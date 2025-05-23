var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { Storage } from '../../glitterBundle/helper/storage.js';
import { ApiPageConfig } from '../../api/pageConfig.js';
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
import { AddComponent } from '../../editor/add-component.js';
import { EditorConfig } from '../../editor-config.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { imageLibrary } from '../../modules/image-library.js';
import { SaasOffer } from '../../saas-offer.js';
export class Setting_editor {
    static left(gvc, viewModel, createID, gBundle) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = String.raw;
            const glitter = gvc.glitter;
            if (!glitter.getUrlParameter('tab')) {
                glitter.setUrlParameter('tab', 'home_page');
            }
            glitter.share.checkData = () => {
                return true;
            };
            const userPlan = GlobalUser.getPlan().id;
            return gvc.bindView(() => {
                const id = glitter.getUUID();
                let initial = false;
                let loading = true;
                let permissionTitle = '';
                let permissionData = {};
                let items = [];
                let menuItems = this.menuItems();
                menuItems = menuItems.filter(item => {
                    if ([
                        'third-party-line',
                        'third-party-facebook',
                        'third-party-google',
                        'manual_send',
                        'send_mail',
                        'send_mail_history',
                        'Sns_manual_send',
                        'send_sns',
                        'send_sns_history',
                        'line_manual_send',
                        'send_line',
                        'send_line_history',
                        'blog_global_setting',
                        'blog_tag_setting',
                        'blog_manager',
                        'rebate_setting',
                        'rebate_activity',
                        'hidden-shop',
                        'single-shop',
                        'line_auto_send',
                    ].includes(item.page)) {
                        return userPlan > 0;
                    }
                    if ([
                        'permission_setting',
                        'member_level',
                        'member_group',
                        'distribution_list',
                        'distribution_users',
                        'fb_live',
                        'ig_live',
                        'line_plus',
                        'market-shopee',
                    ].includes(item.page)) {
                        return userPlan > 1;
                    }
                    if (['app-design', 'app-upload', 'cloud_subscrible', 'notify_message_list', 'auto_fcm_push', 'auto_fcm_advertise', 'upload', 'auto_fcm_history'].includes(item.page)) {
                        return userPlan > 2;
                    }
                    return true;
                });
                if (window.memberType === 'noLimit') {
                    menuItems = menuItems.concat(this.noLimitMenuItems());
                }
                menuItems.map((dd, index) => {
                    if (dd.page === glitter.getUrlParameter('tab')) {
                        Storage.select_item = index;
                    }
                });
                ApiPageConfig.getPrivateConfigV2('backend_list').then(res => {
                    if (res.response.result && res.response.result[0]) {
                        items = res.response.result[0].value;
                    }
                    items = items.filter((dd) => dd);
                    items.map((d1) => {
                        if (!menuItems.find((dd) => {
                            return `${dd.appName}-${dd.page}` === `${d1.appName}-${d1.page}`;
                        })) {
                            menuItems.push(d1);
                        }
                    });
                    items = menuItems;
                    if (parseInt(Storage.select_item, 10) >= items.length) {
                        Storage.select_item = '0';
                    }
                    new Promise((resolve, reject) => {
                        ApiUser.getPermission({
                            page: 0,
                            limit: 1000,
                        }).then(data => {
                            if (data.result) {
                                const find_dd = data.response.data.find((dd) => {
                                    return `${dd.user}` === `${GlobalUser.parseJWT(GlobalUser.saas_token).payload.userID}` && dd.id !== -1;
                                });
                                permissionTitle = find_dd ? `employee` : data.response.store_permission_title;
                                permissionData = find_dd !== null && find_dd !== void 0 ? find_dd : { config: { auth: [] } };
                                resolve();
                            }
                            else {
                                reject();
                            }
                        });
                    }).then(() => {
                        loading = false;
                        removeInvoice();
                        gvc.notifyDataChange(id);
                    });
                });
                function removeInvoice() {
                    ApiPageConfig.getPrivateConfigV2('invoice_setting').then(res => {
                        if (res.response.result[0].value.fincial == 'off_line') {
                            items = items.filter((dd) => {
                                return dd.page != 'invoice_list' && dd.page != 'allowance_list';
                            });
                            gvc.notifyDataChange(id);
                        }
                    });
                }
                return {
                    bind: id,
                    view: () => {
                        Storage.select_bg_btn = 'custom';
                        return html `
                        <div
                            class="d-flex p-3 bg-white border-bottom align-items-end d-lg-none"
                            style="${parseInt(glitter.share.top_inset, 10)
                            ? `padding-top:${glitter.share.top_inset}px !important;`
                            : ``}"
                        >
                            <img style="height: 24px;" src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1718986163099-logo.svg" />
                            <span class="ms-1"
                                  style="font-size: 12px;color: orange;">${glitter.share.editerVersion}</span>
                        </div>
                        <div
                            class="w-100 bg-white"
                            style="overflow-y:auto; ${document.body.offsetWidth > 768
                            ? `padding-top: ${EditorConfig.getPaddingTop(gvc)}px;`
                            : ''}"
                        >
                            ${(() => {
                            if (loading) {
                                return BgWidget.spinner({ text: { visible: false } });
                            }
                            function renderHTML(items) {
                                const authConfig = permissionData.config.auth;
                                let list = [];
                                function click_item(index) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (glitter.share.checkData && !glitter.share.checkData()) {
                                            const dialog = new ShareDialog(glitter);
                                            const result = yield new Promise((resolve, reject) => {
                                                dialog.checkYesOrNot({
                                                    text: '尚未儲存內容，是否確認跳轉?',
                                                    callback: response => {
                                                        resolve(response);
                                                    },
                                                });
                                            });
                                            if (!result) {
                                                return false;
                                            }
                                        }
                                        glitter.share.checkData = () => {
                                            return true;
                                        };
                                        const itemPage = items[parseInt(index)].page;
                                        const page = permissionTitle === 'employee' && !getCRUD(itemPage).read ? 'noPermission' : itemPage;
                                        if (['page_layout', 'dev_mode'].indexOf(page) !== -1) {
                                            const url = new URL(location.href);
                                            if (page === 'page_layout') {
                                                url.searchParams.set('function', 'user-editor');
                                            }
                                            else {
                                                Storage.view_type = 'col3';
                                                url.searchParams.set('function', 'page-editor');
                                            }
                                            location.href = url.href;
                                        }
                                        else {
                                            Storage.select_item = index;
                                            window.editerData = undefined;
                                            glitter.setUrlParameter('tab', page);
                                            const url = new URL('./' + page, glitter.root_path);
                                            url.searchParams.set('appName', items[parseInt(index)].appName);
                                            url.searchParams.set('cms', 'true');
                                            url.searchParams.set('page', page);
                                            gvc.notifyDataChange('top-notice');
                                            $('#editerCenter').html(html `
                                                    <iframe src="${url.href}"
                                                            style="border: none;height: calc(100%);"></iframe>`);
                                        }
                                        return true;
                                    });
                                }
                                items
                                    .filter((dd) => {
                                    if (window.memberType === 'noLimit') {
                                        return true;
                                    }
                                    else {
                                        return ['code_info', 'web_hook_checkout', 'template_upload'].indexOf(dd.page) === -1;
                                    }
                                })
                                    .map((dd, index) => {
                                    let container = list;
                                    const group = dd.group.split('/');
                                    if (dd.group) {
                                        group.map((d3) => {
                                            if (!container.find((dd) => dd.title === d3)) {
                                                container.push({
                                                    type: 'container',
                                                    title: d3,
                                                    child: [],
                                                    toggle: false,
                                                    icon: dd.groupIcon,
                                                });
                                            }
                                            if (Storage.select_item === `${index}`) {
                                                container.find((dd) => {
                                                    return dd.title === d3 && dd.type === 'container';
                                                }).toggle = true;
                                            }
                                            container = container.find((dd) => {
                                                return dd.title === d3 && dd.type === 'container';
                                            }).child;
                                        });
                                        if (dd.groupIcon) {
                                            items
                                                .filter((d2) => {
                                                return d2.group === dd.group;
                                            })
                                                .map((d1) => {
                                                d1.groupIcon = dd.groupIcon;
                                            });
                                        }
                                    }
                                    if (glitter.getUrlParameter('tab') === dd.page && !initial) {
                                        initial = true;
                                        if (['page_layout', 'dev_mode'].indexOf(items[index].page) !== -1) {
                                            Storage.select_item = `5`;
                                            click_item(Storage.select_item);
                                        }
                                        else {
                                            click_item(index);
                                        }
                                    }
                                    container.push({
                                        title: dd.title,
                                        index: index,
                                        info: dd,
                                        toggle: glitter.getUrlParameter('tab') === dd.page,
                                    });
                                });
                                function refreshContainer() {
                                    gvc.notifyDataChange(id);
                                }
                                list.map((dd, index) => {
                                    if (dd.type === 'container' && dd.child.length == 1) {
                                        dd.child[0].icon = dd.icon;
                                        list[index] = dd.child[0];
                                    }
                                });
                                function getCRUD(page) {
                                    const data = authConfig.find((item) => item.key === page);
                                    return data ? data.value : { read: false };
                                }
                                function renderItem(list) {
                                    return gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return list
                                                    .map((dd, index) => {
                                                    var _a, _b;
                                                    if (permissionTitle === 'employee') {
                                                        if (dd.child) {
                                                            if (!dd.child.some((item) => getCRUD(item.info.page).read)) {
                                                                return '';
                                                            }
                                                        }
                                                        else {
                                                            if (!getCRUD(dd.info.page).read) {
                                                                return '';
                                                            }
                                                        }
                                                    }
                                                    return html `
                                                                ${dd.title === '品牌官網' ? html `
                                                                    <div class="my-4 border-top"></div>` : ``}
                                                                <li>
                                                                    <div
                                                                        class="w-100 fw-500 d-flex align-items-center fs-6 hoverBtn h_item rounded px-2 tx_700 ${(_b = (_a = dd === null || dd === void 0 ? void 0 : dd.info) === null || _a === void 0 ? void 0 : _a.guideClass) !== null && _b !== void 0 ? _b : ''} ${dd.type === 'container' ? `mainRow${index}` : ''}"
                                                                        style="gap:7px; color:#393939; ${dd.toggle
                                                        ? `border-radius: 5px; background: #F2F2F2;`
                                                        : ``}"
                                                                        onclick="${gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                                                        try {
                                                            if (items[parseInt(dd.index)].page === 'image_manager') {
                                                                imageLibrary.selectImageLibrary(gvc, urlArray => {
                                                                }, html `
                                                                                            <div
                                                                                                class="d-flex flex-column"
                                                                                                style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                            >
                                                                                                圖片庫
                                                                                            </div>`, { mul: true }, true);
                                                                return;
                                                            }
                                                        }
                                                        catch (e) {
                                                        }
                                                        gvc.glitter.setUrlParameter('page-id');
                                                        if (dd.type === 'container') {
                                                            list.forEach((item, index2) => {
                                                                if (index !== index2) {
                                                                    item.toggle = false;
                                                                }
                                                            });
                                                            dd.toggle = !dd.toggle;
                                                            gvc.notifyDataChange(id);
                                                        }
                                                        else {
                                                            const url = new URL(location.href);
                                                            url.searchParams.forEach((_, key) => {
                                                                if (!['type', 'appName', 'function', 'tab'].includes(key)) {
                                                                    glitter.setUrlParameter(key);
                                                                }
                                                            });
                                                            if ((yield click_item(dd.index)) &&
                                                                ['page_layout', 'dev_mode'].indexOf(items[parseInt(dd.index)].page) === -1) {
                                                                dd.toggle = true;
                                                                refreshContainer();
                                                            }
                                                            glitter.closeDrawer();
                                                        }
                                                    }))}"
                                                                    >
                                                                        ${dd.icon ? html `<img src="${dd.icon}"
                                                                                              style="width:18px;height:18px;" />` : ``}
                                                                        <span>${dd.title}</span>
                                                                        <div class="flex-fill"></div>
                                                                        ${dd.type === 'container'
                                                        ? !dd.toggle
                                                            ? html `
                                                                                    <i class="fa-regular fa-angle-right hoverBtn me-1"
                                                                                       aria-hidden="true"></i>
                                                                                `
                                                            : html ` <i
                                                                                    class="fa-regular fa-angle-down hoverBtn me-1"
                                                                                    aria-hidden="true"
                                                                                ></i>`
                                                        : html `
                                                                                ${dd.info && dd.info.icon
                                                            ? html `<img src="${dd.info.icon}"
                                                                                                style="width:18px;height:18px;" />`
                                                            : ``}
                                                                            `}
                                                                    </div>
                                                                    ${dd.type === 'container'
                                                        ? html `
                                                                            <div
                                                                                class="ps-4 pt-2 pb-2 ${dd.toggle ? `` : `d-none`}">
                                                                                ${renderItem(dd.child)}
                                                                            </div>`
                                                        : ``}
                                                                </li>
                                                            `;
                                                })
                                                    .join('<div class="my-1"></div>');
                                            },
                                            divCreate: {
                                                elem: 'ul',
                                                class: `m-0 `,
                                                option: [
                                                    {
                                                        key: 'id',
                                                        value: id,
                                                    },
                                                ],
                                            },
                                            onCreate: () => {
                                            },
                                        };
                                    });
                                }
                                return html `
                                        <div class="p-2">${renderItem(list)}</div>`;
                            }
                            return renderHTML(items);
                        })()}
                        </div>
                        <div
                            class="bg-white w-100 align-items-center d-flex editor_item_title start-0 z-index-9 ps-2 border-bottom border-top position-absolute bottom-0 border-end d-none"
                            style="z-index: 999;border:none;"
                        >
                            <div
                                class="hoverBtn d-flex align-items-center justify-content-center   border  me-2"
                                style="height:30px;width:30px;border-radius:5px;cursor:pointer;color:#151515;"
                                onclick="${gvc.event(() => {
                            Setting_editor.addPlugin(gvc, () => {
                                gvc.notifyDataChange(id);
                            });
                        })}"
                            >
                                <i class="fa-solid fa-puzzle-piece-simple" aria-hidden="true"></i>
                            </div>
                        </div>
                    `;
                    },
                    divCreate: { style: `` },
                };
            });
        });
    }
    static addPlugin(gvc, callback) {
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        let items = [];
        function addPlugin(updateModel) {
            let postMd = updateModel || {
                icon: '',
                title: '',
                group: '',
                page: '',
                groupIcon: '',
                appName: '',
                moduleName: '',
            };
            return gvc.bindView(() => {
                const postId = gvc.glitter.getUUID();
                return {
                    bind: postId,
                    view: () => {
                        return html `
                            <div class="position-relative bgf6 d-flex align-items-center p-2 border-bottom shadow">
                                <span class="fs-6 fw-bold "
                                      style="color:black;">${updateModel ? `插件設定` : '新增插件'}</span>
                                <div class="flex-fill"></div>
                                <button
                                    class="btn btn-primary-c ${updateModel ? `d-none` : ``}"
                                    style="height: 28px;width:40px;font-size:14px;"
                                    onclick="${gvc.event(() => {
                            items.push(postMd);
                            NormalPageEditor.back();
                        })}"
                                >
                                    儲存
                                </button>
                            </div>
                            <div class="p-2">
                                ${[
                            EditorElem.editeInput({
                                gvc: gvc,
                                title: '標題',
                                default: postMd.title,
                                placeHolder: '請輸入插件標題',
                                callback: text => {
                                    postMd.title = text;
                                },
                            }),
                            EditorElem.searchInput({
                                gvc: gvc,
                                title: html `群組分類
                                        <div
                                            class="alert alert-info p-2 mt-2 fs-base fw-500 mb-0"
                                            style="word-break: break-all;white-space:normal"
                                        >
                                            加入 / 進行分類:<br />例如:頁面/登入/註冊設定
                                        </div>`,
                                def: postMd.group,
                                array: (() => {
                                    let array = [];
                                    items.map((dd) => {
                                        if (!array.find((d1) => {
                                            return d1 === dd.group;
                                        })) {
                                            array.push(dd.group);
                                        }
                                    });
                                    return array;
                                })(),
                                placeHolder: '請輸入群組分類',
                                callback: text => {
                                    postMd.group = text;
                                    if (items.find((dd) => {
                                        return dd.group === text && dd.groupIcon;
                                    })) {
                                        postMd.groupIcon = items.find((dd) => {
                                            return dd.group === text && dd.groupIcon;
                                        }).groupIcon;
                                    }
                                    gvc.notifyDataChange(postId);
                                },
                            }),
                            EditorElem.uploadImage({
                                title: '群組ICON',
                                gvc: gvc,
                                def: postMd.groupIcon || '',
                                callback: icon => {
                                    postMd.groupIcon = icon;
                                },
                            }),
                            EditorElem.buttonPrimary(postMd.moduleName || '選擇模塊', gvc.event(() => {
                                NormalPageEditor.toggle({
                                    visible: true,
                                    view: gvc.bindView(() => {
                                        return {
                                            bind: gvc.glitter.getUUID(),
                                            view: () => {
                                                return new Promise((resolve, reject) => {
                                                    resolve(AddComponent.addModuleView(gvc, 'backend', (tData) => {
                                                        postMd.appName = tData.copyApp;
                                                        postMd.page = tData.copy;
                                                        postMd.moduleName = tData.title;
                                                        NormalPageEditor.back();
                                                    }, false, true));
                                                });
                                            },
                                        };
                                    }),
                                    title: '選擇插件',
                                });
                            })),
                        ].join('')}
                            </div>
                        `;
                    },
                };
            });
        }
        NormalPageEditor.closeEvent = () => {
            gvc.recreateView();
        };
        NormalPageEditor.toggle({
            visible: true,
            title: '設定CMS插件',
            view: (() => {
                const viewComponent = {
                    add_plus: (title, event) => {
                        return html `
                            <div
                                class="w-100 fw-500 d-flex align-items-center justify-content-center fs-6 hoverBtn h_item border rounded"
                                style="gap:5px;color:#3366BB;"
                                onclick="${event}"
                            >
                                <i class="fa-solid fa-plus"></i>
                                <span>${title}</span>
                            </div>`;
                    },
                };
                return gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    let select = '';
                    ApiPageConfig.getPrivateConfigV2('backend_list').then(res => {
                        res.response.result[0] && (items = res.response.result[0].value);
                        items = items.filter((dd) => dd);
                        gvc.notifyDataChange(id);
                    });
                    return {
                        bind: id,
                        view: () => {
                            const list = [];
                            items.map((dd, index) => {
                                let container = list;
                                const group = dd.group.split('/');
                                if (dd.group) {
                                    group.map((d3) => {
                                        if (!container.find((dd) => dd.title === d3)) {
                                            container.push({
                                                type: 'container',
                                                title: d3,
                                                child: [],
                                                toggle: select === dd,
                                                icon: dd.groupIcon,
                                            });
                                        }
                                        container = container.find((dd) => {
                                            return dd.title === d3 && dd.type === 'container';
                                        }).child;
                                    });
                                    if (dd.groupIcon) {
                                        items
                                            .filter((d2) => {
                                            return d2.group === dd.group;
                                        })
                                            .map((d1) => {
                                            d1.groupIcon = dd.groupIcon;
                                        });
                                    }
                                }
                                container.push({
                                    title: dd.title,
                                    index: index,
                                    info: dd,
                                });
                            });
                            function refreshContainer() {
                                gvc.notifyDataChange(id);
                            }
                            function renderItems(list) {
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return list
                                                .map((dd, index) => {
                                                return html `
                                                        <li>
                                                            <div
                                                                class="w-100 fw-500 d-flex align-items-center  fs-6 hoverBtn h_item  rounded px-2"
                                                                style="gap:5px;color:#393939;"
                                                                onclick="${gvc.event(() => {
                                                    if (dd.type === 'container') {
                                                        dd.toggle = !dd.toggle;
                                                        gvc.notifyDataChange(id);
                                                    }
                                                })}"
                                                            >
                                                                ${dd.type === 'container'
                                                    ? !dd.toggle
                                                        ? html ` <i
                                                                            class="fa-regular fa-angle-right hoverBtn me-1"
                                                                            aria-hidden="true"></i> `
                                                        : html `<i
                                                                            class="fa-regular fa-angle-down hoverBtn me-1"
                                                                            aria-hidden="true"></i>`
                                                    : html `
                                                                        ${dd.info && dd.info.icon
                                                        ? `<img src="${dd.info.icon}" style="width:18px;height:18px;">`
                                                        : ``}
                                                                    `}
                                                                ${dd.icon ? `<img src="${dd.icon}" style="width:18px;height:18px;">` : ``}
                                                                <span>${dd.title}</span>
                                                                <div class="flex-fill"></div>
                                                                ${dd.type === 'container'
                                                    ? ``
                                                    : html `
                                                                        <i
                                                                            class="fa-solid fa-pencil text-black hoverBtn me-2 child"
                                                                            onclick="${gvc.event(() => {
                                                        select = dd.info;
                                                        NormalPageEditor.toggle({
                                                            visible: true,
                                                            view: addPlugin(select),
                                                            title: dd.title,
                                                        });
                                                    })}"
                                                                        ></i>
                                                                        <i
                                                                            class="fa-sharp fa-solid fa-trash-can text-black hoverBtn me-2 child"
                                                                            onclick="${gvc.event(() => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.checkYesOrNot({
                                                            callback: response => {
                                                                if (response) {
                                                                    items = items.filter((d2, index) => {
                                                                        return index !== dd.index;
                                                                    });
                                                                    list.splice(index, 1);
                                                                    if (list.length === 0) {
                                                                        refreshContainer();
                                                                    }
                                                                    else {
                                                                        gvc.notifyDataChange(id);
                                                                    }
                                                                }
                                                            },
                                                            text: '是否確認刪除插件?',
                                                        });
                                                    })}"
                                                                        ></i>
                                                                    `}
                                                                <i class="fa-solid fa-grip-dots-vertical"></i>
                                                            </div>
                                                            ${dd.type === 'container'
                                                    ? html `
                                                                    <div class="ps-2 ${dd.toggle ? `` : `d-none`}">
                                                                        ${renderItems(dd.child)}
                                                                    </div>`
                                                    : ``}
                                                        </li>
                                                    `;
                                            })
                                                .join('');
                                        },
                                        divCreate: {
                                            elem: 'ul',
                                            option: [
                                                {
                                                    key: 'id',
                                                    value: id,
                                                },
                                            ],
                                        },
                                        onCreate: () => {
                                            function swapArr(arr, index1, index2) {
                                                const data = arr[index1];
                                                arr.splice(index1, 1);
                                                arr.splice(index2, 0, data);
                                            }
                                            let startIndex = 0;
                                            Sortable.create(document.getElementById(id), {
                                                group: gvc.glitter.getUUID(),
                                                animation: 100,
                                                onChange: function (evt) {
                                                },
                                                onEnd: (evt) => {
                                                    let changeItemStart = 0;
                                                    let changeItemEnd = 0;
                                                    function findStartIndex(it) {
                                                        if (it.type === 'container') {
                                                            findStartIndex(it.child[0]);
                                                        }
                                                        else {
                                                            changeItemStart = it.index;
                                                        }
                                                    }
                                                    findStartIndex(list[startIndex]);
                                                    function findEndIndex(it) {
                                                        if (it.type === 'container') {
                                                            findEndIndex(it.child[0]);
                                                        }
                                                        else {
                                                            changeItemEnd = it.index;
                                                        }
                                                    }
                                                    findEndIndex(list[evt.newIndex]);
                                                    swapArr(items, changeItemStart, changeItemEnd);
                                                    swapArr(list, startIndex, evt.newIndex);
                                                },
                                                onStart: function (evt) {
                                                    startIndex = evt.oldIndex;
                                                },
                                            });
                                        },
                                    };
                                });
                            }
                            return html `
                                <div class="position-relative bgf6 d-flex align-items-center p-2 border-bottom shadow">
                                    <span class="fs-6 fw-bold " style="color:black;">插件設定</span>
                                    <div class="flex-fill"></div>
                                    <button
                                        class="btn btn-primary-c"
                                        style="height: 28px;width:40px;font-size:14px;"
                                        onclick="${gvc.event(() => {
                                dialog.dataLoading({ visible: true });
                                ApiPageConfig.setPrivateConfigV2({
                                    key: 'backend_list',
                                    value: JSON.stringify(items),
                                }).then(res => {
                                    dialog.dataLoading({ visible: false });
                                    if (res.result) {
                                        dialog.successMessage({ text: '儲存成功' });
                                    }
                                    else {
                                        dialog.errorMessage({ text: '伺服器異常' });
                                    }
                                });
                            })}"
                                    >
                                        儲存
                                    </button>
                                </div>
                                <div class="container pt-2">
                                    ${renderItems(list)}
                                    <div class="my-1"></div>
                                    ${[
                                viewComponent.add_plus('新增插件', gvc.event(() => {
                                    NormalPageEditor.toggle({
                                        visible: true,
                                        view: addPlugin(),
                                        title: '新增插件',
                                    });
                                })),
                            ].join(``)}
                                </div>
                            `;
                        },
                        divCreate: {
                            class: `w-100`,
                        },
                    };
                });
            })(),
            width: 350,
        });
    }
}
Setting_editor.pluginUrl = '';
Setting_editor.menuItems = () => {
    return [
        {
            icon: '',
            page: 'home_page',
            group: '首頁',
            title: '首頁',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716559696051-Component 56.svg',
            moduleName: '首頁',
        },
        {
            icon: '',
            page: 'shop_informationV2',
            group: '商店設定',
            title: '全站設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '商店設計',
            guideClass: 'guide6-2',
        },
        {
            icon: '',
            page: 'shop_rule',
            group: '商店設定',
            title: '商店條款',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '商店設計',
        },
        {
            icon: '',
            page: 'seo_setting',
            group: '商店設定',
            title: 'SEO設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '商店設計',
        },
        {
            icon: '',
            page: 'checkout_setting',
            group: '商店設定',
            title: '結帳設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '金流 / 物流 / 發票',
        },
        {
            icon: '',
            page: 'setFinanceWay',
            group: '商店設定',
            title: '金流設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '金流 / 物流 / 發票',
            guideClass: 'guide2-2',
        },
        {
            icon: '',
            page: 'shippment_setting',
            group: '商店設定',
            title: '物流設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '金流 / 物流 / 發票',
            guideClass: 'guide3-2',
        },
        {
            icon: '',
            page: 'rebate_setting',
            group: '商店設定',
            title: '購物金設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '購物金設定',
        },
        {
            icon: '',
            page: 'invoice_setting',
            group: '商店設定',
            title: '發票設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '金流 / 物流 / 發票',
        },
        {
            icon: '',
            page: 'permission_setting',
            group: '商店設定',
            title: '員工設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716566571091-Property 1=gear-regular.svg',
            moduleName: '員工設定',
        },
        {
            icon: '',
            page: 'product-manager',
            group: '商品管理',
            title: '商品列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/product_icon.svg',
            moduleName: '商品管理',
            guideClass: 'guide5-2',
        },
        {
            icon: '',
            page: 'collection_v2',
            group: '商品管理',
            title: '商品分類',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/product_icon.svg',
        },
        {
            icon: '',
            page: 'add-on-items',
            group: '商品管理',
            title: '加購商品',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/product_icon.svg',
            moduleName: '商品管理',
            guideClass: 'guide5-2',
        },
        {
            icon: '',
            page: 'give-away-items',
            group: '商品管理',
            title: '滿額贈品',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/product_icon.svg',
            moduleName: '商品管理',
            guideClass: 'guide5-2',
        },
        {
            icon: '',
            page: 'hidden-product',
            group: '商品管理',
            title: '隱形商品',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/product_icon.svg',
            moduleName: '商品管理',
            guideClass: 'guide5-2',
        },
        {
            icon: '',
            page: 'text-manager',
            group: '商品管理',
            title: '商品顯示',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/product_icon.svg',
            moduleName: '商品管理',
        },
        {
            icon: '',
            page: 'stock',
            group: '庫存管理',
            title: '庫存列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
        },
        {
            icon: '',
            page: 'stock_restocking',
            group: '庫存管理',
            title: '進貨單列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
        },
        {
            icon: '',
            page: 'stock_transfer',
            group: '庫存管理',
            title: '調撥單列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
        },
        {
            icon: '',
            page: 'stock_checking',
            group: '庫存管理',
            title: '盤點單列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
        },
        {
            icon: '',
            page: 'stock_stores',
            group: '庫存管理',
            title: '庫存點管理',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
        },
        {
            icon: '',
            page: 'stock_vendors',
            group: '庫存管理',
            title: '供應商管理',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652645450-boxes-stacked-regular (1).svg',
        },
        {
            icon: '',
            page: 'order_list',
            group: '訂單管理',
            title: '訂單列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652949790-Component 56 (3).svg',
            moduleName: '訂單列表',
        },
        {
            icon: '',
            page: 'order_list_archive',
            group: '訂單管理',
            title: '已封存訂單',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652949790-Component 56 (3).svg',
            moduleName: '訂單列表',
        },
        {
            icon: '',
            page: 'shipment_list',
            group: '訂單管理',
            title: '出貨單列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652949790-Component 56 (3).svg',
            moduleName: '訂單列表',
        },
        {
            icon: '',
            page: 'shipment_list_archive',
            group: '訂單管理',
            title: '已封存出貨單',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652949790-Component 56 (3).svg',
            moduleName: '訂單列表',
        },
        {
            icon: '',
            page: 'out-delivery',
            group: '訂單管理',
            title: '退貨單',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716652949790-Component 56 (3).svg',
        },
        {
            icon: '',
            page: 'reconciliation_area',
            group: '訂單管理',
            title: '對帳單',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/Component 56 (7).svg',
            moduleName: 'dashboard_ec',
        },
        {
            icon: '',
            page: 'invoice_list',
            group: '訂單管理',
            title: '發票列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/file-invoice-dollar-sharp-light.svg',
        },
        {
            icon: '',
            page: 'member_manager',
            group: '顧客管理',
            title: '顧客設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713360844009-Component 56 (1).svg',
            moduleName: '會員設定',
        },
        {
            icon: '',
            page: 'user_list',
            group: '顧客管理',
            title: '顧客列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713360844009-Component 56 (1).svg',
            moduleName: '用戶列表',
        },
        {
            icon: '',
            page: 'member_group',
            group: '顧客管理',
            title: '顧客分群',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713360844009-Component 56 (1).svg',
            moduleName: '用戶列表',
        },
        {
            icon: '',
            page: 'member_level',
            group: '顧客管理',
            title: '會員等級',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713360844009-Component 56 (1).svg',
            moduleName: '用戶列表',
        },
        {
            icon: '',
            page: 'discount_setting',
            group: '優惠促銷',
            title: '折扣活動',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713370923228-Component 56 (3).svg',
            moduleName: '優惠券管理',
        },
        {
            icon: '',
            page: 'rebate_activity',
            group: '優惠促銷',
            title: '購物金活動',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713370923228-Component 56 (3).svg',
            moduleName: '優惠券管理',
        },
        {
            icon: '',
            page: 'giveaway_discount',
            group: '優惠促銷',
            title: '贈品活動',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713370923228-Component 56 (3).svg',
            moduleName: '優惠券管理',
        },
        {
            icon: '',
            page: 'add_on_activity',
            group: '優惠促銷',
            title: '加購活動',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713370923228-Component 56 (3).svg',
            moduleName: '優惠券管理',
        },
        {
            icon: '',
            page: 'no_fee_activity',
            group: '優惠促銷',
            title: '免運費活動',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713370923228-Component 56 (3).svg',
            moduleName: '優惠券管理',
        },
        {
            icon: '',
            page: 'rebate',
            group: '優惠促銷',
            title: '購物金紀錄',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/Component 56 (7).svg',
            moduleName: '購物金紀錄',
        },
        {
            icon: '',
            page: 'operational_order',
            group: '數據分析',
            title: '營運分析',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/Component 56 (7).svg',
            moduleName: 'dashboard_ec',
        },
        {
            icon: '',
            page: 'Product_analysis',
            group: '數據分析',
            title: '商品分析',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/Component 56 (7).svg',
            moduleName: 'dashboard_ec',
        },
        {
            icon: '',
            page: 'hidden-shop',
            group: '行銷推廣',
            title: '隱形賣場',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722230748790-Component 56.svg',
            moduleName: 'dashboard_ec',
        },
        {
            icon: '',
            page: 'single-shop',
            group: '行銷推廣',
            title: '一頁商店',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722230748790-Component 56.svg',
            moduleName: 'dashboard_ec',
        },
        {
            icon: '',
            page: 'distribution_list',
            group: '行銷推廣',
            title: '分銷連結',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722230748790-Component 56.svg',
            moduleName: 'dashboard_ec',
        },
        {
            icon: '',
            page: 'distribution_users',
            group: '行銷推廣',
            title: '推薦人列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722230748790-Component 56.svg',
            moduleName: 'dashboard_ec',
        },
        {
            icon: '',
            page: 'fb_live',
            group: '社群電商',
            title: 'FB直播',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/webhook-sharp-regular.svg',
            moduleName: '社群電商',
        },
        {
            icon: '',
            page: 'ig_live',
            group: '社群電商',
            title: 'IG直播',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/webhook-sharp-regular.svg',
            moduleName: '社群電商',
        },
        {
            icon: '',
            page: 'line_plus',
            group: '社群電商',
            title: 'LINE團購',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/webhook-sharp-regular.svg',
            moduleName: '社群電商',
        },
        {
            icon: '',
            page: 'auto_send',
            group: '信件群發',
            title: '信件自動發送',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
            moduleName: '已訂閱郵件',
        },
        {
            icon: '',
            page: 'manual_send',
            group: '信件群發',
            title: '行銷EDM',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
            moduleName: '群發設定',
        },
        {
            icon: '',
            page: 'send_mail',
            group: '信件群發',
            title: '信件樣式',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
            moduleName: '群發設定',
        },
        {
            icon: '',
            page: 'send_mail_history',
            group: '信件群發',
            title: '寄件紀錄',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713375442916-Component 56 (4).svg',
            moduleName: '群發設定',
        },
        {
            icon: '',
            page: 'form_receive',
            group: '顧客管理',
            title: '表單收集',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713514549253-calendar-lines-pen-regular.svg',
            moduleName: '表單管理',
        },
        {
            icon: '',
            page: 'Sns_auto_send',
            group: '簡訊群發',
            title: '簡訊自動發送',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/message-lines-regular.svg',
            moduleName: 'SNS自動發送',
        },
        {
            icon: '',
            page: 'Sns_manual_send',
            group: '簡訊群發',
            title: '手動寄件',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/message-lines-regular.svg',
            moduleName: 'SNS群發設定',
        },
        {
            icon: '',
            page: 'send_sns',
            group: '簡訊群發',
            title: '簡訊定型文',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/message-lines-regular.svg',
            moduleName: 'SNS群發設定',
        },
        {
            icon: '',
            page: 'send_sns_history',
            group: '簡訊群發',
            title: '寄件紀錄',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/message-lines-regular.svg',
            moduleName: 'SNS群發設定',
        },
        {
            icon: '',
            page: 'line_auto_send',
            group: 'LINE群發',
            title: 'LINE 自動發送',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/line-brands-solid (2).svg',
            moduleName: 'line自動發送',
        },
        {
            icon: '',
            page: 'line_manual_send',
            group: 'LINE群發',
            title: '手動發送',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/line-brands-solid (2).svg',
            moduleName: 'line群發設定',
        },
        {
            icon: '',
            page: 'send_line',
            group: 'LINE群發',
            title: '訊息定型文',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/line-brands-solid (2).svg',
            moduleName: 'line群發設定',
        },
        {
            icon: '',
            page: 'send_line_history',
            group: 'LINE群發',
            title: '寄件紀錄',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/line-brands-solid (2).svg',
            moduleName: 'line群發設定',
        },
        {
            icon: '',
            page: 'third-party-line',
            group: '第三方整合',
            title: 'LINE 串接設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/list-tree-regular.svg',
            moduleName: 'line自動發送',
        },
        {
            icon: '',
            page: 'third-party-facebook',
            group: '第三方整合',
            title: '臉書 FB 串接設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/list-tree-regular.svg',
            moduleName: 'line自動發送',
        },
        {
            icon: '',
            page: 'third-party-google',
            group: '第三方整合',
            title: 'Google 串接設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/list-tree-regular.svg',
            moduleName: 'line自動發送',
        },
        {
            icon: '',
            page: 'third-party-apple',
            group: '第三方整合',
            title: 'Apple 串接設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/list-tree-regular.svg',
            moduleName: 'line自動發送',
        },
        {
            icon: '',
            page: 'market-america',
            group: '第三方整合',
            title: '美安串接設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/list-tree-regular.svg',
            moduleName: '美安',
        },
        {
            icon: '',
            page: 'market-shopee',
            group: '第三方整合',
            title: '蝦皮串接同步設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/list-tree-regular.svg',
            moduleName: '蝦皮',
        },
        {
            icon: '',
            page: 'web_theme',
            group: '品牌官網',
            title: '佈景主題',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
            moduleName: '商店設計',
            guideClass: 'guide7-2',
        },
        {
            icon: '',
            page: 'page_manager',
            group: '品牌官網',
            title: '分頁列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
            moduleName: '網誌管理',
        },
        {
            icon: '',
            page: 'menus-setting',
            group: '品牌官網',
            title: '選單管理',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
            moduleName: '網誌管理',
        },
        {
            icon: '',
            page: 'image_manager',
            group: '品牌官網',
            title: '圖庫管理',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716654741305-Component 56 (5).svg',
            moduleName: '商店設計',
            guideClass: '',
        },
        {
            icon: '',
            page: 'blog_global_setting',
            group: 'Blog 網誌',
            title: '網誌目錄',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/blog-solid (3).svg',
            moduleName: '網誌管理',
        },
        {
            icon: '',
            page: 'blog_tag_setting',
            group: 'Blog 網誌',
            title: '網誌分類',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/blog-solid (3).svg',
            moduleName: '網誌管理',
        },
        {
            icon: '',
            page: 'blog_manager',
            group: 'Blog 網誌',
            title: '網誌列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/blog-solid (3).svg',
            moduleName: '網誌管理',
        },
        {
            icon: '',
            page: 'app-upload',
            group: '品牌APP',
            title: 'APP發布上架',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716655243577-Component 56 (6).svg',
            moduleName: 'IOS應用上架',
        },
        {
            icon: '',
            page: 'auto_fcm_push',
            group: '品牌APP',
            title: '自動推播訊息',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713414599944-Component 56 (5).svg',
            moduleName: '訂閱裝置管理',
        },
        {
            icon: '',
            page: 'auto_fcm_advertise',
            group: '品牌APP',
            title: '行銷推播發送',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713414599944-Component 56 (5).svg',
            moduleName: '訂閱裝置管理',
        },
        {
            icon: '',
            page: 'auto_fcm_history',
            group: '品牌APP',
            title: 'APP推播紀錄',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713414599944-Component 56 (5).svg',
            moduleName: '訂閱裝置管理',
        },
        {
            icon: '',
            page: 'pos_setting',
            group: 'POS實體門市',
            title: 'POS設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/cash-register-regular (1).svg',
        },
        {
            icon: '',
            page: 'shop_list',
            group: 'POS實體門市',
            title: '門市設定',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/cash-register-regular (1).svg',
        },
        {
            icon: '',
            page: 'work-status',
            group: 'POS實體門市',
            title: '上下班打卡',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/cash-register-regular (1).svg',
            moduleName: 'POS實體門市',
        },
        {
            icon: '',
            page: 'summary-pos',
            group: 'POS實體門市',
            title: '每日小結單',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/cash-register-regular (1).svg',
            moduleName: 'POS實體門市',
        },
        {
            icon: '',
            page: 'exhibition_list',
            group: 'POS實體門市',
            title: '展場列表',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/cash-register-regular (1).svg',
        },
        ...(() => {
            if (SaasOffer.is_dealer) {
                return [];
            }
            else {
                return [{
                        icon: '',
                        page: 'member_plan',
                        group: `方案與加值中心`,
                        title: '開店方案',
                        appName: 'cms_system',
                        groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719982993525-credit-card-regular.svg',
                        moduleName: '方案管理',
                    }];
            }
        })(),
        {
            icon: '',
            page: 'ai-point',
            group: `方案與加值中心`,
            title: 'AI 代幣',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719982993525-credit-card-regular.svg',
            moduleName: '方案管理',
        },
        {
            icon: '',
            page: 'sms-points',
            group: `方案與加值中心`,
            title: 'SMS 代幣',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719982993525-credit-card-regular.svg',
            moduleName: '方案管理',
        },
    ];
};
Setting_editor.noLimitMenuItems = () => {
    return [
        {
            icon: '',
            page: 'code_info',
            group: '擴充套件',
            title: 'GraphQL API',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
            moduleName: '結帳事件',
        },
        {
            icon: '',
            page: 'web_hook_checkout',
            group: '擴充套件',
            title: '結帳事件',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
            moduleName: '結帳事件',
        },
        {
            icon: '',
            page: 'seo_custom',
            group: '擴充套件',
            title: 'SEO自訂',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
            moduleName: '結帳事件',
        },
        {
            icon: '',
            page: 'site_map',
            group: '擴充套件',
            title: 'SiteMap自訂',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713419947572-code-solid.svg',
            moduleName: '後端代碼事件',
        },
        {
            icon: '',
            page: 'template_upload',
            group: '擴充套件',
            title: '模板發佈',
            appName: 'cms_system',
            groupIcon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713418629944-Component 56 (7).svg',
            moduleName: '模板發佈',
        },
    ];
};
