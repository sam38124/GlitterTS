import { ShareDialog } from "../../dialog/ShareDialog.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { SetGlobalValue } from "../../editor/set-global-value.js";
import { PageSettingView } from "../../editor/page-setting-view.js";
import { Storage } from "../../glitterBundle/helper/storage.js";
export class Setting_editor {
    static left(gvc, viewModel, createID, gBundle) {
        const html = String.raw;
        const glitter = gvc.glitter;
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
                            const data = dd.view(gvc);
                            if (typeof data === 'string') {
                                $('#editerCenter').html(data);
                            }
                            else {
                                data.then((res) => {
                                    $('#editerCenter').html(res);
                                });
                            }
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
                        return `<div class="add_item_button ${(dd.key === Storage.select_bg_btn) ? `add_item_button_active` : ``}" onclick="${gvc.event((e, event) => {
                            Storage.select_bg_btn = dd.key;
                            gvc.notifyDataChange(id);
                        })}" style="font-size:14px;">${dd.label}</div>`;
                    }).join('')}
                        </div>` + (() => {
                        switch (Storage.select_bg_btn) {
                            case "official":
                                return html `
                                    <div class="alert alert-info m-2 p-3 d-none"
                                         style="white-space: normal;word-break: break-all;">
                                        已下為官方提供的後台開發管理工具，能為您解決基本的系統開發需求。
                                    </div>
                                    ${[
                                    setBackendEditor(`fa-regular fa-globe me-1`, `網站設定`, [
                                        {
                                            title: `SEO管理`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(html `
                                                                <div class="w-100 d-flex  justify-content-center pt-4"
                                                                     style="min-height: calc(100vh - 60px);">
                                                                    <div style="width:600px;background-color:#f3f6ff !important;" class="border pt-2">
                                                                        ${PageSettingView.seoSetting({
                                                            gvc: gvc,
                                                            id: glitter.getUUID(),
                                                            vid: '',
                                                            viewModel: {
                                                                get selectItem() {
                                                                    return viewModel.data;
                                                                }
                                                            },
                                                            page_select: true
                                                        })}
                                                                    </div>
                                                                </div>
                                                            `);
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `網域設定`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    resolve(html `
                                                            <div class="w-100 d-flex align-items-center justify-content-center"
                                                                 style="min-height: calc(100vh - 60px);">
                                                                <div style="width:600px;" class="border">
                                                                    ${SetGlobalValue.domainSetting(gvc)}
                                                                </div>
                                                            </div>`);
                                                });
                                            }
                                        }
                                    ], id),
                                    setBackendEditor(`fa-regular fa-user me-1`, `用戶相關`, [
                                        {
                                            title: `登入設定`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(BgProject.setLoginConfig(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `用戶列表`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(BgProject.userManager(gvc, 'list'));
                                                    });
                                                });
                                            }
                                        }
                                    ], id),
                                    setBackendEditor(`fa-regular fa-shop me-1`, `電子商務`, [
                                        {
                                            title: `金流 / 物流 / 發票`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-shopping.js', import.meta.url).href, (BgShopping) => {
                                                        resolve(BgShopping.setFinanceWay(gvc) + BgShopping.logistics_setting(gvc) + BgShopping.invoice_setting(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `商品管理`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-shopping.js', import.meta.url).href, (BgShopping) => {
                                                        resolve(BgShopping.productManager(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `商品系列`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-shopping.js', import.meta.url).href, (BgShopping) => {
                                                        resolve(BgShopping.collectionManager({
                                                            gvc: gvc
                                                        }));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `訂單管理`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-shopping.js', import.meta.url).href, (BgShopping) => {
                                                        resolve(BgShopping.orderManager(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `折扣管理`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-shopping.js', import.meta.url).href, (BgShopping) => {
                                                        resolve(BgShopping.voucherManager(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `運費設定`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-shopping.js', import.meta.url).href, (BgShopping) => {
                                                        resolve(BgShopping.setShipment(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `回饋金`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-wallet.js', import.meta.url).href, (BgWallet) => {
                                                        resolve(BgWallet.rebateList(gvc));
                                                    });
                                                });
                                            }
                                        }
                                    ], id),
                                    setBackendEditor(`fa-regular fa-blog me-1`, `Blog / 網誌`, [
                                        {
                                            title: `內容管理`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-blog.js', import.meta.url).href, (BgBlog) => {
                                                        resolve(BgBlog.contentManager(gvc, 'list'));
                                                    });
                                                });
                                            }
                                        }
                                    ], id),
                                    setBackendEditor(`fa-regular fa-wallet me-1`, `電子錢包`, [
                                        {
                                            title: `增減紀錄`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-wallet.js', import.meta.url).href, (BgWallet) => {
                                                        resolve(BgWallet.walletList(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `提領請求`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-wallet.js', import.meta.url).href, (BgWallet) => {
                                                        resolve(BgWallet.withdrawRequest(gvc));
                                                    });
                                                });
                                            }
                                        }
                                    ], id),
                                    setBackendEditor(`fa-regular fa-envelopes-bulk`, `信件群發`, [
                                        ...(() => {
                                            let cCat = [];
                                            cCat.push({
                                                title: `已訂閱郵件`,
                                                view: (gvc) => {
                                                    return new Promise((resolve, reject) => {
                                                        glitter.getModule(new URL('../../backend-manager/bg-notify.js', import.meta.url).href, (BgNotify) => {
                                                            resolve(BgNotify.email(gvc));
                                                        });
                                                    });
                                                }
                                            });
                                            cCat.push({
                                                title: `群發設定`,
                                                view: (gvc) => {
                                                    return new Promise((resolve, reject) => {
                                                        glitter.getModule(new URL('../../backend-manager/bg-notify.js', import.meta.url).href, (BgNotify) => {
                                                            resolve(BgNotify.emailSetting(gvc));
                                                        });
                                                    });
                                                }
                                            });
                                            return cCat;
                                        })()
                                    ], id),
                                    setBackendEditor(`fa-regular fa-paper-plane`, `雲消息傳遞`, [
                                        ...(() => {
                                            let cCat = [];
                                            cCat.push({
                                                title: `訂閱裝置管理`,
                                                view: (gvc) => {
                                                    return new Promise((resolve, reject) => {
                                                        glitter.getModule(new URL('../../backend-manager/bg-notify.js', import.meta.url).href, (BgNotify) => {
                                                            resolve(BgNotify.fcmDevice(gvc));
                                                        });
                                                    });
                                                }
                                            });
                                            cCat.push({
                                                title: `推播訊息管理`,
                                                view: (gvc) => {
                                                    return new Promise((resolve, reject) => {
                                                        glitter.getModule(new URL('../../backend-manager/bg-notify.js', import.meta.url).href, (BgNotify) => {
                                                            resolve(BgNotify.fcmSetting(gvc));
                                                        });
                                                    });
                                                }
                                            });
                                            return cCat;
                                        })()
                                    ], id),
                                    setBackendEditor(`fa-sharp fa-regular fa-cloud-arrow-up`, `應用發佈`, [
                                        {
                                            title: `模板發佈`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(BgProject.templateReleaseForm(gvc));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `蘋果商城`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(BgProject.appRelease(gvc, 'apple_release'));
                                                    });
                                                });
                                            }
                                        },
                                        {
                                            title: `安卓商城`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(BgProject.appRelease(gvc, 'android_release'));
                                                    });
                                                });
                                            }
                                        }
                                    ], id)
                                ].join('')}

                                    ${(window.memberType === 'noLimit') ? setBackendEditor(`fa-solid fa-code`, `自訂代碼事件`, [
                                    ...(() => {
                                        let cCat = [];
                                        cCat.push({
                                            title: `登入事件`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(BgProject.loginHook(gvc));
                                                    });
                                                });
                                            }
                                        });
                                        cCat.push({
                                            title: `購物事件`,
                                            view: (gvc) => {
                                                return new Promise((resolve, reject) => {
                                                    glitter.getModule(new URL('../../backend-manager/bg-project.js', import.meta.url).href, (BgProject) => {
                                                        resolve(BgProject.checkoutHook(gvc));
                                                    });
                                                });
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
                                                <div class="alert alert-info m-2 p-2 fw-500 fs-6"
                                                     style="white-space: normal;word-break: break-all;">
                                                    透過官方或第三方平台取得相關後台套件，來達成所有客製化系統開發。
                                                </div>
                                            ` + EditorElem.arrayItem({
                                                gvc: gvc,
                                                title: `<div class="d-flex w-100">選項列表<div class="flex-fill"></div>
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
                                                        const res = {
                                                            title: dd.title,
                                                            innerHtml: (gvc) => {
                                                                glitter.setUrlParameter('router', dd.title);
                                                                window.editerData = undefined;
                                                                const url = new URL((glitter.share.editorViewModel.domain) ? `https://${glitter.share.editorViewModel.domain}/?page=index` : location.href);
                                                                url.searchParams.set("page", dd.page);
                                                                url.searchParams.delete("type");
                                                                url.searchParams.set("cms", 'true');
                                                                $('#editerCenter').html(`<iframe src="${url.href}" style="border: none;height: calc(100vh - 70px);"></iframe>`);
                                                            },
                                                            editTitle: dd.title,
                                                            width: 'auto',
                                                            saveAble: false
                                                        };
                                                        if (glitter.getUrlParameter('router') === dd.title) {
                                                            setTimeout(() => {
                                                                res.innerHtml(gvc);
                                                            }, 10);
                                                        }
                                                        return res;
                                                    });
                                                },
                                                originalArray: vm.data.array,
                                                expand: {},
                                                refreshComponent: () => {
                                                    gvc.notifyDataChange(id);
                                                },
                                                customEditor: true,
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

<div class="mt-2 border border-white p-2 fw-500 fs-6">
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
                                                                                EditorElem.pageSelect(gvc, '選擇頁面', (_c = obj.page) !== null && _c !== void 0 ? _c : "", (data) => {
                                                                                    obj.page = data;
                                                                                }, (dd) => {
                                                                                    return dd.page_type === 'backend';
                                                                                })
                                                                            ].join('');
                                                                        },
                                                                        divCreate: {
                                                                            class: `mb-2`
                                                                        }
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
Setting_editor.pluginUrl = '';