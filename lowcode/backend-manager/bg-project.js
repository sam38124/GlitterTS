var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import { BgShopping } from "./bg-shopping.js";
import { PageEditor } from "../editor/page-editor.js";
import { BgWidget } from "./bg-widget.js";
import { ApiUser } from "../glitter-base/route/user.js";
const html = String.raw;
export class BgProject {
    static setLoginConfig(gvc) {
        const saasConfig = window.saasConfig;
        const html = String.raw;
        const dialog = new ShareDialog(gvc.glitter);
        let keyData = {
            verify: 'normal',
            name: '',
            content: '',
            title: '',
            verify_forget: 'mail',
            forget_title: '',
            forget_content: '',
            forget_page: ''
        };
        function save(next) {
            const dialog = new ShareDialog(gvc.glitter);
            dialog.dataLoading({ text: '設定中', visible: true });
            saasConfig.api.setPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`, keyData).then((r) => {
                dialog.dataLoading({ visible: false });
                if (r.response) {
                    next();
                }
                else {
                    dialog.errorMessage({ text: "設定失敗" });
                }
            });
        }
        return BgShopping.container(html `
            <div class="d-flex w-100 align-items-center mb-3 ">
                ${BgShopping.title(`登入設定`)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;" onclick="${gvc.event(() => {
            save(() => {
                dialog.successMessage({
                    text: '設定成功'
                });
            });
        })}">儲存並更改
                </button>
            </div>
            ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_loginConfig`).then((data) => {
                var _a;
                if (data.response.result[0]) {
                    keyData = data.response.result[0].value;
                    keyData.verify_forget = (_a = keyData.verify_forget) !== null && _a !== void 0 ? _a : 'mail';
                    gvc.notifyDataChange(id);
                }
            });
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        resolve(html `
                                <div style="width:900px;max-width:100%;"> ${BgShopping.card([
                            EditorElem.select({
                                title: '登入認證',
                                gvc: gvc,
                                def: keyData.verify,
                                array: [
                                    { title: '無需認證', value: "normal" },
                                    { title: '信箱認證', value: "mail" }
                                ],
                                callback: (text) => {
                                    keyData.verify = text;
                                    gvc.notifyDataChange(id);
                                }
                            }),
                            (() => {
                                var _a, _b;
                                if (keyData.verify === 'mail') {
                                    keyData.content = (_a = keyData.content) !== null && _a !== void 0 ? _a : '';
                                    keyData.title = (_b = keyData.title) !== null && _b !== void 0 ? _b : '嗨！歡迎加入 GLITTER.AI，請輸入驗證碼。';
                                    if (keyData.content.indexOf('@{{code}}') === -1) {
                                        keyData.content = `嗨！歡迎加入 GLITTER.AI，請輸入驗證碼「 @{{code}} 」。請於1分鐘內輸入並完成驗證。`;
                                    }
                                    return [
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '寄件者名稱',
                                            default: keyData.name,
                                            callback: (text) => {
                                                keyData.name = text;
                                                gvc.notifyDataChange(id);
                                            },
                                            placeHolder: '請輸入寄件者名稱'
                                        }),
                                        EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '信件標題',
                                            default: keyData.title,
                                            callback: (text) => {
                                                keyData.title = text;
                                                gvc.notifyDataChange(id);
                                            },
                                            placeHolder: '請輸入信件標題'
                                        }),
                                        EditorElem.h3('信件內容'),
                                        EditorElem.richText({
                                            gvc: gvc,
                                            def: keyData.content,
                                            callback: (text) => {
                                                keyData.content = text;
                                            }
                                        })
                                    ].join('');
                                }
                                else {
                                    return ``;
                                }
                            })()
                        ].join('<div class="my-2"></div>'))}
                                    <div class="my-4">${BgShopping.title(`忘記密碼設定`)}</div>
                                    ${BgShopping.card([
                            EditorElem.select({
                                title: '忘記密碼',
                                gvc: gvc,
                                def: keyData.verify_forget,
                                array: [
                                    { title: '信箱認證', value: "mail" },
                                ],
                                callback: (text) => {
                                    keyData.verify_forget = text;
                                    gvc.notifyDataChange(id);
                                }
                            }),
                            (() => {
                                keyData.forget_title = keyData.forget_title || "忘記密碼";
                                keyData.forget_content = keyData.forget_content || '';
                                if (keyData.forget_content.indexOf('@{{code}}') === -1) {
                                    keyData.forget_content = html `
                                                    <div style="margin:0">
                                                        <table style="height:100%!important;width:100%!important;border-spacing:0;border-collapse:collapse">
                                                            <tbody>
                                                            <tr>
                                                                <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                    <table class="m_-7325585852261570963header"
                                                                           style="width:100%;border-spacing:0;border-collapse:collapse;margin:40px 0 20px">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                <center>

                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td class="m_-7325585852261570963shop-name__cell"
                                                                                                            style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <h1 style="font-weight:normal;font-size:30px;color:#333;margin:0">
                                                                                                                <a href="">GLITTER.AI</a>
                                                                                                            </h1>
                                                                                                        </td>

                                                                                                    </tr>
                                                                                                    </tbody>
                                                                                                </table>

                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody>
                                                                                    </table>

                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <table style="width:100%;border-spacing:0;border-collapse:collapse">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;padding-bottom:40px;border-width:0">
                                                                                <center>
                                                                                    <table class="m_-7325585852261570963container"
                                                                                           style="width:560px;text-align:left;border-spacing:0;border-collapse:collapse;margin:0 auto">
                                                                                        <tbody>
                                                                                        <tr>
                                                                                            <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">

                                                                                                <h2 style="font-weight:normal;font-size:24px;margin:0 0 10px">
                                                                                                    重設密碼</h2>
                                                                                                <p style="color:#777;line-height:150%;font-size:16px;margin:0">
                                                                                                    利用此連結前往 <a
                                                                                                >GLITTER.AI</a>
                                                                                                    重設你的顧客帳號密碼。如果你沒有申請新密碼，
                                                                                                    <wbr>
                                                                                                    可以安心刪除這封電子郵件。
                                                                                                </p>
                                                                                                <table style="width:100%;border-spacing:0;border-collapse:collapse;margin-top:20px">
                                                                                                    <tbody>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;line-height:0em">
                                                                                                            &nbsp;
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif">
                                                                                                            <table class="m_-7325585852261570963button m_-7325585852261570963main-action-cell"
                                                                                                                   style="border-spacing:0;border-collapse:collapse;float:left;margin-right:15px">
                                                                                                                <tbody>
                                                                                                                <tr>
                                                                                                                    <td style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;border-radius:4px"
                                                                                                                        align="center"
                                                                                                                        bgcolor="black">
                                                                                                                        <a href="@{{code}}"
                                                                                                                           class="m_-7325585852261570963button__text"
                                                                                                                           style="font-size:16px;text-decoration:none;display:block;color:#fff;padding:20px 25px">重設密碼</a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                                </tbody>
                                                                                                            </table>


                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    </tbody>
                                                                                                </table>


                                                                                            </td>
                                                                                        </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </center>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <div class="yj6qo"></div>
                                                        <div class="adL">
                                                        </div>
                                                    </div>`;
                                }
                                return [
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '信件標題',
                                        default: keyData.forget_title,
                                        callback: (text) => {
                                            keyData.forget_title = text;
                                            gvc.notifyDataChange(id);
                                        },
                                        placeHolder: '請輸入信件標題'
                                    }),
                                    EditorElem.pageSelect(gvc, '重設密碼頁面', keyData.forget_page, (data) => {
                                        keyData.forget_page = data;
                                    }),
                                    EditorElem.h3('信件內容'),
                                    EditorElem.richText({
                                        gvc: gvc,
                                        def: keyData.forget_content,
                                        callback: (text) => {
                                            keyData.forget_content = text;
                                        }
                                    })
                                ].join('');
                            })()
                        ].join('<div class="my-2"></div>'))}
                                </div>`);
                    }));
                },
                divCreate: { class: `d-flex flex-column flex-column-reverse  flex-md-row`, style: `gap:10px;` }
            };
        })}
        `, 900);
    }
    static setGlobalValue(gvc) {
        gvc.glitter.share.editorViewModel.selectItem = undefined;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        PageEditor.valueRender(gvc).then((response) => {
                            resolve(BgShopping.container([html `
                                <div class="d-flex w-100 align-items-center mb-3 ">
                                    ${BgShopping.title(`共用資源`)}
                                    <div class="flex-fill"></div>
                                    <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                                            onclick="${gvc.event(() => {
                                    gvc.glitter.htmlGenerate.saveEvent(false);
                                })}">儲存並更改
                                    </button>
                                </div>
                            `,
                                BgShopping.card(html `
                                    <div class="d-flex">
                                        <div class="border-end " style="width:350px;overflow:hidden;">${response.left}
                                        </div>
                                        <div class="flex-fill " style="width:400px;">${response.right}</div>
                                    </div>`, 'p-0 bg-white rounded border'),
                            ].join(''), 700));
                        });
                    }));
                }
            };
        });
    }
    static userManager(gvc) {
        const glitter = gvc.glitter;
        const vm = {
            type: "list",
            data: {
                "id": 61,
                "userID": 549313940,
                "account": "jianzhi.wang@homee.ai",
                "userData": { "name": "王建智", "email": "jianzhi.wang@homee.ai", "phone": "0978028739" },
                "created_time": "2023-11-26T02:14:09.000Z",
                "role": 0,
                "company": null,
                "status": 1
            },
            dataList: undefined,
            query: ''
        };
        const filterID = gvc.glitter.getUUID();
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgShopping.container(html `
                            <div class="d-flex w-100 align-items-center mb-3 ">
                                ${BgShopping.title('用戶管理')}
                                <div class="flex-fill"></div>
                            </div>
                            ${BgWidget.table({
                            gvc: gvc,
                            getData: (vmi) => {
                                ApiUser.getUserList({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query || undefined
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    function getDatalist() {
                                        return data.response.data.map((dd) => {
                                            return [
                                                {
                                                    key: EditorElem.checkBoxOnly({
                                                        gvc: gvc,
                                                        def: (!data.response.data.find((dd) => {
                                                            return !dd.checked;
                                                        })),
                                                        callback: (result) => {
                                                            data.response.data.map((dd) => {
                                                                dd.checked = result;
                                                            });
                                                            vmi.data = getDatalist();
                                                            vmi.callback();
                                                            gvc.notifyDataChange(filterID);
                                                        }
                                                    }),
                                                    value: EditorElem.checkBoxOnly({
                                                        gvc: gvc,
                                                        def: dd.checked,
                                                        callback: (result) => {
                                                            dd.checked = result;
                                                            vmi.data = getDatalist();
                                                            vmi.callback();
                                                            gvc.notifyDataChange(filterID);
                                                        },
                                                        style: "height:25px;"
                                                    })
                                                },
                                                {
                                                    key: '用戶名稱',
                                                    value: `<span class="fs-7">${dd.userData.name}</span>`
                                                },
                                                {
                                                    key: '用戶信箱',
                                                    value: `<span class="fs-7">${dd.userData.email}</span>`
                                                },
                                                {
                                                    key: '建立時間',
                                                    value: `<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd hh:mm')}</span>`
                                                },
                                                {
                                                    key: '用戶狀態',
                                                    value: (() => {
                                                        if (dd.status === 1) {
                                                            return `<div class="badge bg-info fs-7" style="max-height:34px;">啟用中</div>`;
                                                        }
                                                        else {
                                                            return `<div class="badge bg-danger fs-7" style="max-height:34px;">已停用</div>`;
                                                        }
                                                    })()
                                                }
                                            ];
                                        });
                                    }
                                    vmi.data = getDatalist();
                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {
                                vm.data = vm.dataList[index];
                                vm.type = "replace";
                            },
                            filter: html `
                                    <div style="height:50px;" class="w-100 border-bottom">
                                        <input class="form-control h-100 " style="border: none;"
                                               placeholder="搜尋所有用戶" onchange="${gvc.event((e, event) => {
                                vm.query = e.value;
                                gvc.notifyDataChange(id);
                            })}" value="${vm.query || ''}">
                                    </div>
                                    ${gvc.bindView(() => {
                                return {
                                    bind: filterID,
                                    view: () => {
                                        if (!vm.dataList || !vm.dataList.find((dd) => {
                                            return dd.checked;
                                        })) {
                                            return ``;
                                        }
                                        else {
                                            return [
                                                `<span class="fs-7 fw-bold">操作選項</span>`,
                                                `<button class="btn btn-danger fs-7 px-2" style="height:30px;border:none;" onclick="${gvc.event(() => {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    dialog.checkYesOrNot({
                                                        text: '是否確認移除所選項目?',
                                                        callback: (response) => {
                                                            if (response) {
                                                                dialog.dataLoading({ visible: true });
                                                                ApiUser.deleteUser({
                                                                    id: vm.dataList.filter((dd) => {
                                                                        return dd.checked;
                                                                    }).map((dd) => {
                                                                        return dd.id;
                                                                    }).join(`,`)
                                                                }).then((res) => {
                                                                    dialog.dataLoading({ visible: false });
                                                                    if (res.result) {
                                                                        vm.dataList = undefined;
                                                                        gvc.notifyDataChange(id);
                                                                    }
                                                                    else {
                                                                        dialog.errorMessage({ text: "刪除失敗" });
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                })}">批量移除</button>`
                                            ].join(``);
                                        }
                                    },
                                    divCreate: () => {
                                        return {
                                            class: `d-flex align-items-center p-2 py-3 ${(!vm.dataList || !vm.dataList.find((dd) => {
                                                return dd.checked;
                                            })) ? `d-none` : ``}`,
                                            style: `height:40px;gap:10px;`
                                        };
                                    }
                                };
                            })}
                                `
                        })}
                        `);
                    }
                    else if (vm.type == 'replace') {
                        console.log(JSON.stringify(vm.data));
                        return BgShopping.container([
                            `<div class="d-flex w-100 align-items-center mb-3 ">
                ${BgShopping.goBack(gvc.event(() => {
                                vm.type = 'list';
                            }))} ${BgShopping.title(vm.data.userData.name)}
                <div class="flex-fill"></div>
                <button class="btn btn-primary-c" style="height:38px;font-size: 14px;"
                        onclick="${gvc.event(() => {
                                const dialog = new ShareDialog(gvc.glitter);
                                dialog.dataLoading({ text: "更新中", visible: true });
                                ApiUser.updateUserDataManager(vm.data, vm.data.userID).then((response) => {
                                    dialog.dataLoading({ text: "", visible: false });
                                    if (response.result) {
                                        dialog.successMessage({ text: "更新成功!" });
                                        gvc.notifyDataChange(id);
                                    }
                                    else {
                                        dialog.errorMessage({ text: "更新異常!" });
                                    }
                                });
                            })}">儲存
                </button>
            </div>`,
                            BgShopping.card([
                                ...(() => {
                                    let map = [];
                                    (vm.data.userData.name) && map.push(`
                                    <div class="fw-bold fs-7">用戶名稱</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.name}</div>`);
                                    (vm.data.userID) && map.push(`
                                    <div class="fw-bold fs-7">用戶ID</div>
                                    <div class="fw-normal fs-7">${vm.data.userID}</div>`);
                                    (vm.data.userData.email) && map.push(`
                                    <div class="fw-bold fs-7">用戶信箱</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.email}</div>`);
                                    (vm.data.userData.phone) && map.push(`
                                    <div class="fw-bold fs-7">用戶電話</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.phone}</div>`);
                                    (vm.data.userData.address) && map.push(`
                                    <div class="fw-bold fs-7">用戶地址</div>
                                    <div class="fw-normal fs-7">${vm.data.userData.address}</div>`);
                                    (vm.data.created_time) && map.push(`
                                    <div class="fw-bold fs-7">建立時間</div>
                                    <div class="fw-normal fs-7">${glitter.ut.dateFormat(new Date(vm.data.created_time), 'yyyy-MM-dd hh:mm')}</div>`);
                                    return map;
                                })()
                            ].join(`<div class="my-2 bgf6 w-100" style="height:1px;"></div>`)),
                            BgShopping.card([
                                gvc.bindView(() => {
                                    const id = glitter.getUUID();
                                    const vmi = {
                                        mode: 'read'
                                    };
                                    return {
                                        bind: id,
                                        view: () => {
                                            var _a, _b;
                                            return html `
                                                <div class="d-flex align-items-center ">
                                                    <div class="fw-bold fs-7">備註</div>
                                                    <div class="flex-fill"></div>
                                                    <i class="fa-solid fa-pencil" style="cursor:pointer;" onclick="${gvc.event(() => {
                                                vmi.mode = (vmi.mode === 'edit') ? 'read' : 'edit';
                                                gvc.notifyDataChange(id);
                                            })}"></i>
                                                </div>
                                                ${(vmi.mode == 'read') ? `
                                                 <div class="fs-7 w-100 mt-2  lh-lg fw-normal"
                                                     style="word-break: break-all;white-space:normal;">
                                                    ${((_a = vm.data.userData.managerNote) !== null && _a !== void 0 ? _a : "尚未填寫").replace(/\n/g, `<br>`)}
                                                </div>
                                                ` : EditorElem.editeText({
                                                gvc: gvc,
                                                title: '',
                                                default: (_b = vm.data.userData.managerNote) !== null && _b !== void 0 ? _b : "",
                                                placeHolder: '',
                                                callback: (text) => {
                                                    vm.data.userData.managerNote = text;
                                                }
                                            })}
                                            `;
                                        },
                                        divCreate: {
                                            class: `fw-normal`,
                                        }
                                    };
                                })
                            ].join(`<div class="my-2 bgf6 w-100" style="height:1px;"></div>`))
                        ].join('<div class="my-2"></div>'), 700);
                    }
                    else {
                        return ``;
                    }
                }
            };
        });
    }
}
