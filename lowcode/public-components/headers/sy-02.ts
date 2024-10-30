import {GVC} from "../../glitterBundle/GVController.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {getCheckoutCount} from "../../official_event/e-commerce/get-count.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";


const html = String.raw

export class Sy02 {
    public static main(gvc: GVC, widget: any, subData: any) {
        let changePage = (index: string, type: 'page' | 'home', subData: any) => {}
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, (cl) => {
            changePage = cl.changePage
        })

        return html`
            <div style="height: 76px;"></div>
            <nav class="navbar navbar-expand-lg vw-100 header header-place shadow  position-fixed top-0 left-0  py-0"
                 style="background:  ${widget.formData.theme_color['background'] ?? '#000'} !important;height: 76px;z-index:9999;">
                <div class="container header-place  h-100">
                    <!--LOGO顯示區塊-->
                    <div class="d-flex align-items-center justify-content-center h-100"
                         style="gap: 8px;cursor: pointer;">
                        <!--手機版選單-->
                        <div class="d-flex align-items-center justify-content-center"
                             style="width:40px !important;height:40px !important;" onclick="${gvc.event(() => {
                            gvc.glitter.setDrawer(gvc.bindView(() => {
                                const id = gvc.glitter.getUUID()
                                return {
                                    bind: id,
                                    view: () => {
                                        return html`
                                            <div class="div d-flex align-items-center flex-column w-100 p-3"
                                                 style="border-bottom:1px solid ${widget.formData.theme_color['title']};">
                                                <div class="d-flex align-items-center ">
                                                    <div>
                                                        <div class="h-100" onclick="${gvc.event(() => {
                                                            changePage('index', 'home', {})
                                                        })}"> ${(widget.formData.logo.type === 'text') ? html`
                                                            <div class=" fw-bold d-flex align-items-center justify-content-center"
                                                                 style="width: 150px;    margin-bottom: 20px;font-size: 36px;color: ${widget.formData.theme_color['title'] ?? '#000'};">
                                                                ${widget.formData.logo.value}
                                                            </div>
                                                        ` : html`<img style="width: 150px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 10px;
    margin-bottom: 20px;"
                                                                      src="${widget.formData.logo.value}">
                                                        `}
                                                        </div>

                                                    </div>
                                                </div>
                                                <div class="position-relative"><input
                                                        class="form-control fw-500 "
                                                        placeholder="找商品"
                                                        autocomplete="off" value=""
                                                        onchange="${gvc.event((e, event) => {
                                                            gvc.glitter.href = `/all-product?search=${e.value}`
                                                        })}">

                                                    <div style=" position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: rgb(107, 114, 128);"><i
                                                            class="fa-solid fa-magnifying-glass"></i></div>
                                                </div>
                                            </div>

                                            <div class="offcanvas-body p-0 "
                                            >
                                                ${gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID()
                                                    const vm = {
                                                        data: []
                                                    }
                                                    ApiUser.getPublicConfig('menu-setting', 'manager', (window as any).appName).then((res) => {
                                                        vm.data = res.response.value
                                                        gvc.notifyDataChange(id)
                                                    })
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            function resetToggle() {
                                                                function loop(data: any) {
                                                                    data.map((dd: any) => {
                                                                        (dd as any).open = false
                                                                        loop((dd as any).items ?? [])
                                                                    })
                                                                }

                                                                loop(vm.data)
                                                            }

                                                            function loopItems(data: any,show_border:boolean) {
                                                                return data.map((dd: any) => {
                                                                    return html`
                                                                        <li style="${(show_border) ? `border-bottom: 1px solid ${widget.formData.theme_color['title'] ?? '#000'} !important;`:``}">
                                                                            <div class="nav-link d-flex justify-content-between"
                                                                                 style="padding: 16px;"
                                                                                 onclick="${gvc.event(() => {
                                                                                     if (((dd as any).items ?? []).length === 0) {
                                                                                         if (dd.link) {
                                                                                             gvc.glitter.href = dd.link
                                                                                             gvc.glitter.closeDrawer()
                                                                                         }
                                                                                     } else {
                                                                                         let og = dd.open
                                                                                         resetToggle()
                                                                                         if (!og) {
                                                                                             dd.open = true
                                                                                         }
                                                                                         gvc.notifyDataChange(id)
                                                                                     }
                                                                                 })}">
                                                                                <div style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;"
                                                                                     onclick="${gvc.event((e, event) => {
                                                                                         if (dd.link) {
                                                                                             gvc.glitter.href = dd.link
                                                                                             gvc.glitter.closeDrawer()
                                                                                         }
                                                                                         event.stopPropagation()
                                                                                         event.preventDefault()
                                                                                     })}">${dd.title}
                                                                                </div>
                                                                                ${(dd.items ?? []).length ? `<i class="fa-solid ${dd.open ? `fa-angle-up` : `fa-angle-down`}"
                                                                                   style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;"></i>` : ``}
                                                                            </div>
                                                                            ${dd.open ? `<ul class="ps-3  pb-2">${loopItems(dd.items ?? [],false)}</ul>`:``}
                                                                        </li>
                                                                    `
                                                                }).join('')
                                                            }

                                                            return loopItems(vm.data,true)
                                                        },
                                                        divCreate: {
                                                            class: `navbar-nav me-auto mb-2 mb-lg-0`,
                                                            style: ``,
                                                            elem: `ul`
                                                        }
                                                    }
                                                })}
                                            </div>`
                                    },
                                    divCreate: {
                                        class: `w-100 h-100`, style: `z-index: 9999;overflow-y:auto;
background: ${widget.formData.theme_color['background'] ?? '#000'};overflow-x: hidden;`
                                    }
                                }
                            }), () => {
                                gvc.glitter.openDrawer(280)
                            })
                        })}">
                            <i class="fa-solid fa-bars fa-fw d-md-none " style="font-size: 20px;
    color: ${widget.formData.theme_color['title'] ?? '#000'};"></i>
                        </div>
                        <div class="${(widget.formData.logo.type === 'text') ? `` : `h-100`}"
                             onclick="${gvc.event(() => {
                                 changePage('index', 'home', {})
                             })}"> ${(widget.formData.logo.type === 'text') ? html`
                            <div class=" fw-bold d-flex align-items-center h-100 mb-1 mb-sm-auto"
                                 style="font-size: 28px;line-height: 28px;color: ${widget.formData.theme_color['title'] ?? '#000'};">
                                ${widget.formData.logo.value}
                            </div>
                        ` : html`
                            <img src="${widget.formData.logo.value}" style="height: 100%;">
                        `}
                        </div>
                    </div>
                    <!--選單列表顯示區塊-->
                    <ul class="navbar-nav  d-none d-md-block flex-fill ps-2"
                        style="">
                        ${gvc.bindView(() => {
                            const id = gvc.glitter.getUUID()
                            const vm = {
                                data: []
                            }
                            ApiUser.getPublicConfig('menu-setting', 'manager', (window as any).appName).then((res) => {
                                vm.data = res.response.value
                                gvc.notifyDataChange(id)
                            })
                            return {
                                bind: id,
                                view: () => {
                                    function loopItems(data: any) {
                                        return data.map((dd: any) => {
                                            return html`
                                                    <li class="nav-item dropdown">
                                                        <a class="nav-link header-link "
                                                           style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;cursor: pointer;"
                                                           onclick="${gvc.event(() => {
                                                if (dd.link) {
                                                    gvc.glitter.href = dd.link
                                                }
                                            })}"
                                                        >${dd.title}
                                                            ${dd.items.length > 0 ? `<i class="fa-solid fa-angle-down ms-2"></i>` : ``}</a>
                                                        ${dd.items.length > 0 ? `<ul class="dropdown-menu" style="background:${widget.formData.theme_color['background'] ?? '#000'} !important;
    cursor: pointer;
    z-index: 99999;">${loopItems(dd.items)}</ul>` : ``}
                                                    </li>`
                                        }).join('')
                                    }

                                    return loopItems(vm.data)
                                },
                                divCreate: {
                                    class: `navbar-nav ms-3 me-auto`, style: ``, elem: `ul`
                                }
                            }
                        })}
                    </ul>
                    <div class="d-flex align-items-center">
                        <!--固定按鈕顯示區塊-->
                        <ul class="navbar-nav flex-row ms-auto">
                            <li class="nav-item d-none d-sm-flex align-items-center justify-content-center"
                                style="">
                                ${gvc.bindView(() => {
                                    const vm = {
                                        id: gvc.glitter.getUUID(),
                                        toggle: false
                                    }
                                    return {
                                        bind: vm.id,
                                        view: () => {
                                            if (!vm.toggle) {
                                                return html`<i class="fa-regular fa-magnifying-glass"
                                                               style="color: ${widget.formData.theme_color['title'] ?? '#000'};cursor: pointer;font-size:20px;"
                                                               onclick="${gvc.event(() => {
                                                                   vm.toggle = !vm.toggle
                                                                   gvc.notifyDataChange(vm.id)
                                                               })}"></i>`
                                            } else {
                                                return html`<a
                                                        class="nav-link search-container d-flex align-items-center"
                                                ><i
                                                        class="fa-regular fa-circle-xmark"
                                                        style="color: ${widget.formData.theme_color['title'] ?? '#000'};cursor: pointer;font-size:20px;"
                                                        onclick="${gvc.event(() => {
                                                            vm.toggle = !vm.toggle
                                                            gvc.notifyDataChange(vm.id)
                                                        })}"
                                                ></i><input
                                                        class="ms-3 form-control" style="height:40px;"
                                                        placeholder="輸入商品關鍵字。" autocomplete="off"
                                                        onchange="${gvc.event((e, event) => {
                                                            gvc.glitter.href = `/all-product?search=${e.value}`
                                                            vm.toggle = !vm.toggle
                                                            gvc.notifyDataChange(vm.id)
                                                        })}">
                                                </a>`
                                            }
                                        },
                                        divCreate: {
                                            class: `nav-link search-container`, elem: `a`
                                        }
                                    }
                                })}
                            </li>
                            <li class="nav-item  d-flex align-items-center justify-content-center"
                                style="width:40px !important;">
                                ${gvc.bindView(() => {
                                    const vm = {
                                        id: gvc.glitter.getUUID(),
                                        count: 0
                                    }
                                    getCheckoutCount((count) => {
                                        vm.count = count
                                        gvc.notifyDataChange(vm.id)
                                    })
                                    return {
                                        bind: vm.id,
                                        view: () => {
                                            return html`<span class="position-relative" onclick="${gvc.event(()=>{
                                                gvc.glitter.href='/checkout'
                                            })}">
                                    <i class="fa-duotone fa-cart-shopping"
                                       style="color: ${widget.formData.theme_color['title'] ?? '#000'} !important;cursor: pointer;font-size:20px;"></i>
                                             ${(vm.count) ? `<div class="position-absolute"
                                                  style="font-size: 10px;right: -10px;top: -6px;">
                                                                    <div class="rounded-circle bg-danger text-white  align-items-center justify-content-center fw-500 d-flex"
                                                                         style="width:18px;height: 18px;color: white !important;background:#fe5541;">${vm.count}
                                                                    </div>
                                             </div>` : ``}
                                    </span>`
                                        },
                                        divCreate: {
                                            class: `nav-link js-cart-count `
                                        }
                                    }
                                })}
                            </li>
                            <li class="nav-item d-flex align-items-center justify-content-center ms-3 ms-sm-4"
                                style="">
                                <div class=""
                                     style="background: ${widget.formData.theme_color['solid-button-bg'] ?? '#000'};
color: ${widget.formData.theme_color['solid-button-text'] ?? '#000'};  cursor: pointer;
display: flex;
width: 100px;
padding: 7px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 5px;"
                                     onclick="${gvc.event(() => {
                                         if (GlobalUser.token) {
                                             changePage('account_userinfo', 'page', {})
                                         } else {
                                             changePage('login', 'page', {})
                                         }
                                     })}">${(GlobalUser.token) ? `會員管理`:`會員登入`}</div>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav>`
    }

}

(window as any).glitter.setModule(import.meta.url, Sy02);