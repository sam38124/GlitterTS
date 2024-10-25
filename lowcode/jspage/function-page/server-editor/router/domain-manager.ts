import { GVC } from '../../../../glitterBundle/GVController.js';
import { BgWidget } from '../../../../backend-manager/bg-widget.js';
import { ApiUser } from '../../../../glitter-base/route/user.js';
import { EditorElem } from '../../../../glitterBundle/plugins/editor-elem.js';
import { BackendServer } from '../../../../api/backend-server.js';
import { BaseApi } from '../../../../glitterBundle/api/base.js';
import { config } from '../../../../config.js';
import { ApiPageConfig } from '../../../../api/pageConfig.js';
import { ShareDialog } from '../../../../glitterBundle/dialog/ShareDialog.js';

(window as any).glitter.setModule(import.meta.url, (gvc: GVC) => {
    return gvc.bindView(() => {
        const html = String.raw;
        const id = gvc.glitter.getUUID();
        const config = (window.parent as any).config;
        const vm: {
            type: 'list' | 'post' | 'replace';
            data: any;
            query: string;
            dataList: any;
        } = {
            type: 'list',
            data: {},
            query: '',
            dataList: [],
        };
        let postVm = {
            name: '',
            domain: '',
            version: '',
            port: '',
            file: '',
        };
        const filterID = gvc.glitter.getUUID();
        return {
            bind: id,
            view: () => {
                if (vm.type === 'post') {
                    return BgWidget.container(
                        [
                            html`<div class="title-container">
                                ${BgWidget.goBack(
                                    gvc.event(() => {
                                        vm.type = 'list';
                                        gvc.notifyDataChange(id);
                                    })
                                )}
                                ${BgWidget.title('網域部署')}
                                <div class="flex-fill"></div>
                                <button
                                    class="btn btn-primary-c"
                                    style="height:35px;font-size: 14px;"
                                    onclick="${gvc.event(async () => {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        if (
                                            Object.keys(postVm).find((dd) => {
                                                return !(postVm as any)[dd] && dd !== 'domain';
                                            })
                                        ) {
                                            dialog.errorMessage({ text: '請確實填寫必帶資料。' });
                                            return;
                                        }
                                        dialog.dataLoading({ text: '上傳中', visible: true });
                                        const resp = await BackendServer.postAPI(postVm);
                                        dialog.dataLoading({ visible: false });
                                        if (resp.result) {
                                            dialog.successMessage({
                                                text: '發佈成功',
                                            });
                                            vm.type = 'list';
                                        } else {
                                            dialog.errorMessage({
                                                text: '發佈失敗',
                                            });
                                        }
                                        gvc.notifyDataChange(id);
                                    })}"
                                >
                                    確認發佈
                                </button>
                            </div>`,
                            BgWidget.card(
                                gvc.bindView(() => {
                                    const vid = gvc.glitter.getUUID();
                                    const glitter = gvc.glitter;
                                    let viewModel: { domain: string } = {
                                        domain: '',
                                    };
                                    return {
                                        bind: vid,
                                        view: () => {
                                            return new Promise(async (resolve, reject) => {
                                                const serverINFO = await BackendServer.serverINFO();
                                                resolve(
                                                    questionText(`網域上架步驟`, [
                                                        {
                                                            title: '步驟一：購買網域',
                                                            content: `前往第三方服務購買網域，例如:<br>
                             -<a class="fw-bold mt-2" href="https://domain.hinet.net/#/" target="_blank">中華電信HiNet</a><br>
                             -<a class="fw-bold" href="https://tw.godaddy.com/" target="_blank">GoDaddy</a><br>
                             -<a class="fw-bold" href="https://aws.amazon.com/tw/route53/" target="_blank">AWS Router 53</a><br>
                             `,
                                                        },
                                                        {
                                                            title: '步驟二：更改DNS',
                                                            content: `
                             前往DNS設定，並將A標籤設置為${serverINFO.response.ip}。
                             `,
                                                        },
                                                        {
                                                            title: '步驟三：填寫網域名稱',
                                                            content: `
                             請輸入您的網域名稱:${EditorElem.editeInput({
                                 gvc: gvc,
                                 title: '',
                                 default: viewModel.domain,
                                 placeHolder: `網域名稱`,
                                 callback: (text: string) => {
                                     viewModel.domain = text;
                                 },
                             })}`,
                                                        },
                                                        {
                                                            title: '步驟四：部署網域',
                                                            content: `
DNS設定至少需要10分鐘到72小時才會生效，如設定失敗可以稍加等待後再重新嘗試。
<button type="button" class="btn btn-primary-c  w-100 mt-2" style=""
onclick="${gvc.event(() => {
                                                                const dialog = new ShareDialog(glitter);
                                                                dialog.dataLoading({ text: '', visible: true });
                                                                ApiPageConfig.setDomain({
                                                                    domain: viewModel.domain,
                                                                }).then((response) => {
                                                                    dialog.dataLoading({ text: '', visible: false });
                                                                    if (response.result) {
                                                                        gvc.closeDialog();
                                                                        dialog.successMessage({ text: '設定成功!' });
                                                                    } else {
                                                                        dialog.errorMessage({ text: '設定失敗，DNS設定可能尚未生效或者請確認網域所有權。' });
                                                                    }
                                                                });
                                                            })}"
>點我部署</button>`,
                                                        },
                                                    ])
                                                );
                                            });
                                        },
                                        divCreate: { class: `p-2 position-relative mx-n2 my-n2`, style: `width:400px;` },
                                    };
                                })
                            ),
                        ].join(`<div class="my-3"></div>`)
                    );
                } else {
                    return BgWidget.container(html`
                        <div class="title-container ">
                            ${BgWidget.title('網域配置管理')}
                            <div class="flex-fill"></div>
                            <button
                                class="btn btn-primary-c me-2 px-3"
                                style="height:35px !important;font-size: 14px;border:1px solid black;"
                                onclick="${gvc.event(() => {
                                    EditorElem.openEditorDialog(
                                        gvc,
                                        (gvc) => {
                                            return gvc.bindView(() => {
                                                const vid = gvc.glitter.getUUID();
                                                const glitter = gvc.glitter;
                                                let viewModel: { domain: string; port: string } = {
                                                    domain: '',
                                                    port: '',
                                                };
                                                return {
                                                    bind: vid,
                                                    view: () => {
                                                        return new Promise(async (resolve, reject) => {
                                                            const serverINFO = await BackendServer.serverINFO();
                                                            resolve(
                                                                questionText(`網域上架步驟`, [
                                                                    {
                                                                        title: '步驟一：購買網域',
                                                                        content: html`前往第三方服務購買網域，例如:<br />
                                                                            -<a class="fw-bold mt-2" href="https://domain.hinet.net/#/" target="_blank">中華電信HiNet</a><br />
                                                                            -<a class="fw-bold" href="https://tw.godaddy.com/" target="_blank">GoDaddy</a><br />
                                                                            -<a class="fw-bold" href="https://aws.amazon.com/tw/route53/" target="_blank">AWS Router 53</a><br /> `,
                                                                    },
                                                                    {
                                                                        title: '步驟二：更改DNS',
                                                                        content: html` 前往DNS設定，並將A標籤設置為${serverINFO.response.ip}。 `,
                                                                    },
                                                                    {
                                                                        title: '步驟三：填寫網域名稱',
                                                                        content: html` <div class="mb-2">請輸入您的網域名稱:</div>
                                                                            ${EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                default: viewModel.domain,
                                                                                placeHolder: `網域名稱`,
                                                                                callback: (text: string) => {
                                                                                    viewModel.domain = text;
                                                                                },
                                                                            })}`,
                                                                    },
                                                                    {
                                                                        title: '步驟四：設定導向應用的踔號(PORT)',
                                                                        content: html` <div class="mb-2">PORT號 [ 範圍8000-8100 ] :</div>
                                                                            ${EditorElem.editeInput({
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                default: viewModel.port,
                                                                                placeHolder: `網域名稱`,
                                                                                callback: (text: string) => {
                                                                                    viewModel.port = text;
                                                                                },
                                                                            })}`,
                                                                    },
                                                                    {
                                                                        title: '步驟五：部署網域',
                                                                        content: html` DNS設定至少需要10分鐘到72小時才會生效，如設定失敗可以稍加等待後再重新嘗試。
                                                                            <button
                                                                                type="button"
                                                                                class="btn btn-primary-c  w-100 mt-2"
                                                                                style=""
                                                                                onclick="${gvc.event(() => {
                                                                                    const dialog = new ShareDialog(glitter);
                                                                                    dialog.dataLoading({
                                                                                        text: '部署中...',
                                                                                        visible: true,
                                                                                    });
                                                                                    BackendServer.postDomain(viewModel).then((response) => {
                                                                                        dialog.dataLoading({
                                                                                            visible: false,
                                                                                        });
                                                                                        if (response.result) {
                                                                                            gvc.closeDialog();
                                                                                            dialog.successMessage({ text: '設定成功!' });
                                                                                            location.reload();
                                                                                        } else {
                                                                                            dialog.errorMessage({ text: '設定失敗，DNS設定可能尚未生效或者請確認網域所有權。' });
                                                                                        }
                                                                                    });
                                                                                })}"
                                                                            >
                                                                                點我部署
                                                                            </button>`,
                                                                    },
                                                                ])
                                                            );
                                                        });
                                                    },
                                                    divCreate: { class: ` position-relative `, style: `width:400px;` },
                                                };
                                            });
                                        },
                                        () => {},
                                        400,
                                        '發佈網域'
                                    );
                                })}"
                            >
                                發佈網域
                            </button>
                        </div>
                        ${BgWidget.table({
                            gvc: gvc,
                            getData: (vmi) => {
                                BackendServer.getDomain({
                                    page: vmi.page - 1,
                                    limit: 20,
                                    search: vm.query || undefined,
                                }).then((data) => {
                                    vmi.pageSize = Math.ceil(data.response.total / 20);
                                    vm.dataList = data.response.data;
                                    vmi.data = vm.dataList.map((dd: any) => {
                                        return [
                                            {
                                                key: '網域名稱',
                                                value: dd.domain,
                                            },
                                            {
                                                key: 'PORT號',
                                                value: dd.port,
                                            },
                                            {
                                                key: '移除',
                                                value: html` <div
                                                    class="hoverBtn d-flex align-items-center justify-content-center border rounded text-danger border-danger fs-6"
                                                    style="width:30px;height:30px;"
                                                    onclick="${gvc.event((e, event) => {
                                                        event.stopPropagation();
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        dialog.checkYesOrNot({
                                                            text: `是否確認移除，此網域將停止掛載至踔號${dd.port}!`,
                                                            callback: async (response) => {
                                                                if (response) {
                                                                    dialog.dataLoading({
                                                                        visible: true,
                                                                    });
                                                                    await BackendServer.deleteDomain({
                                                                        domain: dd.domain,
                                                                    });
                                                                    location.reload();
                                                                }
                                                            },
                                                        });
                                                    })}"
                                                >
                                                    <i class="fa-sharp fa-regular fa-trash"></i>
                                                </div>`,
                                            },
                                        ];
                                    });

                                    vmi.loading = false;
                                    vmi.callback();
                                });
                            },
                            rowClick: (data, index) => {},
                            filter: html`
                                ${BgWidget.searchPlace(
                                    gvc.event((e, event) => {
                                        vm.query = e.value;
                                        gvc.notifyDataChange(id);
                                    }),
                                    vm.query || '',
                                    '搜尋所有網域'
                                )}
                                ${gvc.bindView(() => {
                                    return {
                                        bind: filterID,
                                        view: () => {
                                            if (
                                                !vm.dataList ||
                                                !vm.dataList.find((dd: any) => {
                                                    return dd.checked;
                                                })
                                            ) {
                                                return ``;
                                            } else {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                const selCount = vm.dataList.filter((dd: any) => dd.checked).length;
                                                return BgWidget.selNavbar({
                                                    count: selCount,
                                                    buttonList: [
                                                        BgWidget.selEventButton(
                                                            '批量移除',
                                                            gvc.event(() => {
                                                                dialog.checkYesOrNot({
                                                                    text: '是否確認刪除所選項目？',
                                                                    callback: (response) => {
                                                                        if (response) {
                                                                            dialog.dataLoading({ visible: true });
                                                                            ApiUser.deleteUser({
                                                                                id: vm.dataList
                                                                                    .filter((dd: any) => {
                                                                                        return dd.checked;
                                                                                    })
                                                                                    .map((dd: any) => {
                                                                                        return dd.id;
                                                                                    })
                                                                                    .join(`,`),
                                                                            }).then((res) => {
                                                                                dialog.dataLoading({ visible: false });
                                                                                if (res.result) {
                                                                                    vm.dataList = undefined;
                                                                                    gvc.notifyDataChange(id);
                                                                                } else {
                                                                                    dialog.errorMessage({ text: '刪除失敗' });
                                                                                }
                                                                            });
                                                                        }
                                                                    },
                                                                });
                                                            })
                                                        ),
                                                    ],
                                                });
                                            }
                                        },
                                        divCreate: () => {
                                            return {
                                                class: `d-flex align-items-center p-2 py-3 ${
                                                    !vm.dataList ||
                                                    !vm.dataList.find((dd: any) => {
                                                        return dd.checked;
                                                    })
                                                        ? `d-none`
                                                        : ``
                                                }`,
                                                style: ``,
                                            };
                                        },
                                    };
                                })}
                            `,
                        })}
                    `);
                }
            },
            divCreate: {},
        };
    });
});

function questionText(title: string, data: { title: string; content: string }[]) {
    return `<div class="bg-secondary rounded-3 py-2 px-2 ">
          <h2 class="text-center my-3 mt-2" style="font-size:22px;">${title}</h2>
             <div class="accordion mx-2" id="faq">
                ${data
                    .map((dd, index) => {
                        return ` <div class="accordion-item border-0 rounded-3 shadow-sm mb-3">
                  <h3 class="accordion-header">
                    <button class="accordion-button shadow-none rounded-3 ${
                        index === 0 ? '' : 'collapsed'
                    }" type="button" data-bs-toggle="collapse" data-bs-target="#q-${index}" aria-expanded="false" aria-controls="q-1">${dd.title}</button>
                  </h3>
                  <div class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" id="q-${index}" data-bs-parent="#faq" style="">
                    <div class="accordion-body fs-sm pt-0">
                     ${dd.content}
                    </div>
                  </div>
                </div>`;
                    })
                    .join('')}
              
              </div>
        </div>`;
}
