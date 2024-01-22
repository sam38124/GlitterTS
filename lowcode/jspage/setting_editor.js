import { ShareDialog } from "../dialog/ShareDialog.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { BgShopping } from "../backend-manager/bg-shopping.js";
import { BgProject } from "../backend-manager/bg-project.js";
import { BgNotify } from "../backend-manager/bg-notify.js";
import { BgWallet } from "../backend-manager/bg-wallet.js";
import { BgBlog } from "../backend-manager/bg-blog.js";
import { BgSeo } from "../backend-manager/bg-seo.js";
export class Setting_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const html = String.raw;
        const glitter = gvc.glitter;
        let vm = {
            select: `official`,
        };
        function setBackendEditor(fontawsome, title, itemList, id) {
            return html `
                <li class="btn-group w-100" style="margin-top:1px;margin-bottom:1px;" onclick="${gvc.event(() => {
                glitter.setUrlParameter('router', `${title}/${itemList[0].title}`);
                gvc.recreateView();
            })}">
                    <div class="editor_item d-flex   align-items-center px-2 my-0 hi me-n1 w-100  fw-bold
${(!itemList.find((dd) => {
                return glitter.getUrlParameter('router') === `${title}/${dd.title}`;
            })) ? `` : `bgf6 border`}
" style="border-top-right-radius: 0;border-bottom-right-radius: 0;">
                        <div class="subBt ms-n2 d-none">
                            <i class="fa-regular fa-circle-minus d-flex align-items-center justify-content-center subBt "
                               style="width:15px;height:15px;color:red;" aria-hidden="true"></i>
                        </div>
                        <i class="${fontawsome} me-1 d-flex align-items-center justify-content-center"
                           style="width:20px;"></i>${title}
                    </div>
                </li>
                <br>
                <div class="ps-3 ${(!itemList.find((dd) => {
                return glitter.getUrlParameter('router') === `${title}/${dd.title}`;
            })) ? `d-none` : ``} pb-1 border-bottom">
                    ${EditorElem.arrayItem({
                gvc: gvc,
                title: '',
                array: () => {
                    return itemList.map((dd) => {
                        if (!glitter.getUrlParameter('router')) {
                            glitter.setUrlParameter('router', `${title}/${dd.title}`);
                            gvc.recreateView();
                        }
                        if (glitter.getUrlParameter('router') === `${title}/${dd.title}`) {
                            $('#editerCenter').html(dd.view(gvc));
                        }
                        return {
                            title: dd.title,
                            innerHtml: () => {
                                glitter.setUrlParameter('router', `${title}/${dd.title}`);
                                gvc.recreateView();
                                return ``;
                            },
                            editTitle: dd.title,
                            saveEvent: dd.saveEvent,
                            width: dd.width,
                            saveAble: dd.saveAble,
                            isSelect: glitter.getUrlParameter('router') === `${title}/${dd.title}`
                        };
                    });
                },
                customEditor: true,
                minus: false,
                originalArray: itemList,
                expand: {},
                draggable: false,
                copyable: false,
                refreshComponent: () => {
                    gvc.notifyDataChange(id);
                }
            })}
                </div>
            `;
        }
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                        <div class="d-flex border-bottom ">
                            ${[
                        {
                            key: 'official',
                            label: "官方後台套件"
                        }, {
                            key: 'custom',
                            label: "客製化後台套件"
                        }
                    ].map((dd) => {
                        return `<div class="add_item_button ${(dd.key === vm.select) ? `add_item_button_active` : ``}" onclick="${gvc.event((e, event) => {
                            vm.select = dd.key;
                            gvc.notifyDataChange(id);
                        })}" style="font-size:14px;">${dd.label}</div>`;
                    }).join('')}
                        </div>` + (() => {
                        switch (vm.select) {
                            case "official":
                                const itemList = [
                                    {
                                        title: `共用資源`,
                                        view: (gvc) => {
                                            return BgProject.setGlobalValue(gvc);
                                        }
                                    },
                                    {
                                        title: `SEO設定`,
                                        view: (gvc) => {
                                            return BgSeo.mainPage(gvc);
                                        }
                                    },
                                    {
                                        title: `金流 / 發票`,
                                        view: (gvc) => {
                                            return BgShopping.setFinanceWay(gvc) + BgShopping.invoice_setting(gvc);
                                        }
                                    }
                                ];
                                return html `
                                    <div class="alert alert-info m-2 p-3 d-none"
                                         style="white-space: normal;word-break: break-all;">
                                        已下為官方提供的後台開發管理工具，能為您解決基本的系統開發需求。
                                    </div>
                                    ${setBackendEditor(`fa-regular fa-gear me-1`, `專案開發`, itemList, id)}
                                    ${setBackendEditor(`fa-regular fa-user me-1`, `用戶相關`, [
                                    {
                                        title: `登入設定`,
                                        view: (gvc) => {
                                            return BgProject.setLoginConfig(gvc);
                                        }
                                    },
                                    {
                                        title: `用戶列表`,
                                        view: (gvc) => {
                                            return BgProject.userManager(gvc, 'list');
                                        }
                                    }
                                ], id)}
                                    ${setBackendEditor(`fa-regular fa-blog me-1`, `Blog / 網誌`, [
                                    {
                                        title: `內容管理`,
                                        view: (gvc) => {
                                            return BgBlog.contentManager(gvc, 'list');
                                        }
                                    }
                                ], id)}
                                    ${setBackendEditor(`fa-regular fa-shop me-1`, `電子商務`, [
                                    {
                                        title: `商品管理`,
                                        view: (gvc) => {
                                            return BgShopping.productManager(gvc);
                                        }
                                    },
                                    {
                                        title: `商品系列`,
                                        view: (gvc) => {
                                            return BgShopping.collectionManager({
                                                gvc: gvc
                                            });
                                        }
                                    },
                                    {
                                        title: `顯示區塊`,
                                        view: (gvc) => {
                                            return BgShopping.showListManager({
                                                gvc: gvc
                                            });
                                        }
                                    },
                                    {
                                        title: `訂單管理`,
                                        view: (gvc) => {
                                            return BgShopping.orderManager(gvc);
                                        }
                                    },
                                    {
                                        title: `折扣管理`,
                                        view: (gvc) => {
                                            return BgShopping.voucherManager(gvc);
                                        }
                                    },
                                    {
                                        title: `運費設定`,
                                        view: (gvc) => {
                                            return BgShopping.setShipment(gvc);
                                        }
                                    },
                                    {
                                        title: `回饋金`,
                                        view: (gvc) => {
                                            return BgWallet.rebateList(gvc);
                                        }
                                    }
                                ], id)}
                                    ${setBackendEditor(`fa-regular fa-wallet me-1`, `電子錢包`, [
                                    {
                                        title: `增減紀錄`,
                                        view: (gvc) => {
                                            return BgWallet.walletList(gvc);
                                        }
                                    },
                                    {
                                        title: `提領請求`,
                                        view: (gvc) => {
                                            return BgWallet.withdrawRequest(gvc);
                                        }
                                    }
                                ], id)}
                                    ${setBackendEditor(`fa-regular fa-envelopes-bulk`, `信件群發`, [
                                    ...(() => {
                                        let cCat = [];
                                        cCat.push({
                                            title: `已訂閱郵件`,
                                            view: (gvc) => {
                                                return BgNotify.email(gvc);
                                            }
                                        });
                                        cCat.push({
                                            title: `群發設定`,
                                            view: (gvc) => {
                                                return BgNotify.emailSetting(gvc);
                                            }
                                        });
                                        return cCat;
                                    })()
                                ], id)}
                                    ${setBackendEditor(`fa-regular fa-paper-plane`, `雲消息傳遞`, [
                                    ...(() => {
                                        let cCat = [];
                                        cCat.push({
                                            title: `訂閱裝置管理`,
                                            view: (gvc) => {
                                                return BgNotify.fcmDevice(gvc);
                                            }
                                        });
                                        cCat.push({
                                            title: `推播訊息管理`,
                                            view: (gvc) => {
                                                return BgNotify.fcmSetting(gvc);
                                            }
                                        });
                                        return cCat;
                                    })()
                                ], id)}
                                    ${setBackendEditor(`fa-regular fa-messages-question`, `客服回饋`, [
                                    ...(() => {
                                        let cCat = [];
                                        cCat.push({
                                            title: `回饋信件`,
                                            view: (gvc) => {
                                                return BgNotify.rebackMessage(gvc);
                                            }
                                        });
                                        cCat.push({
                                            title: `客服訊息`,
                                            view: (gvc) => {
                                                return BgNotify.customerMessage(gvc);
                                            }
                                        });
                                        return cCat;
                                    })()
                                ], id)}
                                    ${setBackendEditor(`fa-sharp fa-regular fa-cloud-arrow-up`, `應用發佈`, [
                                    {
                                        title: `蘋果商城`,
                                        view: (gvc) => {
                                            return BgProject.appRelease(gvc, 'apple_release');
                                        }
                                    },
                                    {
                                        title: `安卓商城`,
                                        view: (gvc) => {
                                            return BgProject.appRelease(gvc, 'android_release');
                                        }
                                    }
                                ], id)}
                                    ${(window.glitterAuth.memberType === 'noLimit') ? setBackendEditor(`fa-solid fa-code`, `自訂代碼事件`, [
                                    ...(() => {
                                        let cCat = [];
                                        cCat.push({
                                            title: `登入事件`,
                                            view: (gvc) => {
                                                return BgProject.loginHook(gvc);
                                            }
                                        });
                                        cCat.push({
                                            title: `購物事件`,
                                            view: (gvc) => {
                                                return BgProject.checkoutHook(gvc);
                                            }
                                        });
                                        return cCat;
                                    })()
                                ], id) : ``}
                                `;
                            case "custom":
                                return gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    const vm = {
                                        loading: true,
                                        data: {
                                            array: []
                                        }
                                    };
                                    const saasConfig = window.saasConfig;
                                    function getData() {
                                        saasConfig.api.getPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin").then((r) => {
                                            if (r.response.result[0]) {
                                                vm.data = r.response.result[0].value;
                                            }
                                            vm.loading = false;
                                            gvc.notifyDataChange(id);
                                        });
                                    }
                                    getData();
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (vm.loading) {
                                                return ``;
                                            }
                                            return html `
                                                <div class="alert alert-info m-2 p-3"
                                                     style="white-space: normal;word-break: break-all;">
                                                    透過官方或第三方平台取得相關後台套件，來達成所有客製化系統開發。
                                                </div>
                                                <div class="w-100"
                                                     style="border-bottom: 1px solid #e2e5f1 !important;"></div>
                                            ` + EditorElem.arrayItem({
                                                gvc: gvc,
                                                title: `<div class="d-flex w-100">
選項列表
<div class="flex-fill"></div>
<div class="hoverBtn  px-2 ms-0 me-n1" style="cursor:pointer;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick="${gvc.event(() => {
                                                    Setting_editor.addPlugin(gvc, () => {
                                                        getData();
                                                    });
                                                })}">
                                                    <i class="fa-solid fa-puzzle-piece-simple"></i>
                                                </div>
</div>`,
                                                array: () => {
                                                    return vm.data.array.map((dd) => {
                                                        return {
                                                            title: dd.title,
                                                            innerHtml: (gvc) => {
                                                                return gvc.bindView(() => {
                                                                    var _a, _b;
                                                                    glitter.share.backendPlugins = (_a = glitter.share.backendPlugins) !== null && _a !== void 0 ? _a : {};
                                                                    const vid = glitter.getUUID();
                                                                    const id = Setting_editor.pluginUrl;
                                                                    let route = `${dd.route}?callback=${id}`;
                                                                    glitter.share.backeng_callback = (_b = glitter.share.backeng_callback) !== null && _b !== void 0 ? _b : {};
                                                                    glitter.share.backeng_callback[id] = () => {
                                                                        gvc.notifyDataChange(vid);
                                                                    };
                                                                    if (!glitter.share.backendPlugins[route]) {
                                                                        glitter.addMtScript([{
                                                                                src: route,
                                                                                type: 'module'
                                                                            }], () => {
                                                                        }, () => {
                                                                        });
                                                                    }
                                                                    return {
                                                                        bind: vid,
                                                                        view: () => {
                                                                            if (glitter.share.backendPlugins[route]) {
                                                                                return glitter.share.backendPlugins[route](gvc);
                                                                            }
                                                                            else {
                                                                                return `<div class="w-100 d-flex align-items-center justify-content-center pb-4">
<div class="spinner-border"></div>
</div>`;
                                                                            }
                                                                        },
                                                                        divCreate: {
                                                                            class: ``
                                                                        }
                                                                    };
                                                                });
                                                            },
                                                            editTitle: dd.title,
                                                            width: 'auto',
                                                            saveAble: false
                                                        };
                                                    });
                                                },
                                                originalArray: vm.data.array,
                                                expand: {},
                                                refreshComponent: () => {
                                                    gvc.notifyDataChange(id);
                                                },
                                                plus: {
                                                    title: "新增套件",
                                                    event: gvc.event(() => {
                                                        Setting_editor.addPlugin(gvc, () => {
                                                            getData();
                                                        });
                                                    })
                                                },
                                                draggable: false,
                                                copyable: false,
                                                minus: false,
                                            });
                                        }
                                    };
                                });
                        }
                    })();
                },
                divCreate: { style: `border-bottom: 1px solid #e2e5f1 !important;` }
            };
        });
    }
    static center(gvc, viewModel, createID) {
    }
    static addPlugin(gvc, callback) {
        const saasConfig = window.saasConfig;
        gvc.glitter.innerDialog((gvc) => {
            const vm = {
                loading: true,
                data: {
                    array: []
                },
            };
            const did = gvc.glitter.getUUID();
            saasConfig.api.getPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin").then((r) => {
                if (r.response.result[0]) {
                    vm.data = r.response.result[0].value;
                }
                vm.loading = false;
                gvc.notifyDataChange(did);
            });
            return gvc.bindView(() => {
                return {
                    bind: did,
                    view: () => {
                        return ` <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4">客製化後台套件</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                            gvc.closeDialog();
                        })}"></i>
</div>    

<div class="mt-2 border border-white p-2">
<div class="alert alert-info " style="white-space:normal;">
您可以透過添加插件來拓展你的後台系統應用．
</div>
${(() => {
                            if (vm.loading) {
                                return `  <div class="w-100 d-flex align-items-center justify-content-center">
  <div class="spinner-border " role="status">
  <span class="sr-only"></span>
</div>
</div>`;
                            }
                            else {
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return EditorElem.arrayItem({
                                                originalArray: vm.data.array,
                                                gvc: gvc,
                                                title: '後台套件設定',
                                                array: () => {
                                                    return vm.data.array.map((obj, index) => {
                                                        var _a;
                                                        return {
                                                            title: (_a = obj.title) !== null && _a !== void 0 ? _a : `第${index + 1}個後台插件`,
                                                            expand: obj,
                                                            innerHtml: (gvc) => {
                                                                const selectID = gvc.glitter.getUUID();
                                                                return gvc.bindView(() => {
                                                                    return {
                                                                        bind: selectID,
                                                                        view: () => {
                                                                            var _a, _b, _c;
                                                                            return [
                                                                                EditorElem.fontawesome({
                                                                                    title: 'ICON圖示',
                                                                                    gvc: gvc,
                                                                                    def: (_a = obj.icon) !== null && _a !== void 0 ? _a : "",
                                                                                    callback: (text) => {
                                                                                        obj.icon = text;
                                                                                    }
                                                                                }),
                                                                                EditorElem.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: "插件名稱",
                                                                                    default: (_b = obj.title) !== null && _b !== void 0 ? _b : "",
                                                                                    placeHolder: "請輸入插件名稱",
                                                                                    callback: (text) => {
                                                                                        obj.title = text;
                                                                                    }
                                                                                }),
                                                                                EditorElem.editeInput({
                                                                                    gvc: gvc,
                                                                                    title: "插件路徑",
                                                                                    default: (_c = obj.route) !== null && _c !== void 0 ? _c : "",
                                                                                    placeHolder: "請輸入插件路徑",
                                                                                    callback: (text) => {
                                                                                        obj.route = text;
                                                                                    }
                                                                                })
                                                                            ].join('');
                                                                        },
                                                                        divCreate: {}
                                                                    };
                                                                });
                                                            },
                                                            saveEvent: () => {
                                                                gvc.notifyDataChange(id);
                                                            },
                                                            minus: gvc.event(() => {
                                                                vm.data.array.splice(index, 1);
                                                                gvc.notifyDataChange(did);
                                                            }),
                                                            width: "400px"
                                                        };
                                                    });
                                                },
                                                expand: { expand: true },
                                                plus: {
                                                    title: '添加後台插件',
                                                    event: gvc.event(() => {
                                                        vm.data.array.push({});
                                                        gvc.notifyDataChange(did);
                                                    }),
                                                },
                                                refreshComponent: () => {
                                                    gvc.notifyDataChange(id);
                                                }
                                            });
                                        },
                                        divCreate: {
                                            class: `mx-n2`
                                        }
                                    };
                                });
                            }
                        })()}
</div>
<div class="d-flex pb-2 px-2 justify-content-end">
<button class="btn btn-primary-c d-flex align-items-center " style="height:40px;" onclick="${gvc.event(() => {
                            const dialog = new ShareDialog(gvc.glitter);
                            dialog.dataLoading({ text: '設定中', visible: true });
                            saasConfig.api.setPrivateConfig(saasConfig.config.appName, "glitter_backend_plugin", vm.data).then((r) => {
                                dialog.dataLoading({ visible: false });
                                if (r.response) {
                                    callback();
                                    dialog.successMessage({ text: "儲存成功" });
                                }
                                else {
                                    dialog.errorMessage({ text: "儲存失敗" });
                                }
                            });
                        })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存</button>
</div>
`;
                    },
                    divCreate: {
                        class: `m-auto bg-white shadow rounded overflow-auto`,
                        style: `max-width: 100%;max-height: calc(100% - 20px);width:400px;`
                    }
                };
            });
        }, 'addPlugin');
    }
}
Setting_editor.index = '2';
Setting_editor.pluginUrl = '';
