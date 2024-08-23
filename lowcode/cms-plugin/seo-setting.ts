import { GVC } from '../glitterBundle/GVController.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BaseApi } from '../glitterBundle/api/base.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';

export class SeoSetting {
    public static main(gvc: GVC) {
        const html = String.raw;
        const id = gvc.glitter.getUUID();
        const glitter = gvc.glitter;
        const vm: { loading: boolean; page_list: any; select_page: string; plugin: any } = {
            loading: true,
            page_list: [],
            select_page: '',
            plugin: '',
        };
        const config = (window.parent as any).config;
        async function getData() {
            const plugin = await BaseApi.create({
                url: config.url + `/api/v1/app?appName=${config.appName}`,
                type: 'GET',
                timeout: 0,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: config.token,
                },
            });
            vm.plugin = plugin.response.result[0].config;
            const data = await ApiPageConfig.getPage({
                appName: config.appName,
                type: 'template',
                token: config.token,
            });
            vm.loading = false;
            vm.page_list = data.response.result.filter((data: any) => {
                return data.page_type != 'module' && data.page_type != 'article';
            });
            vm.select_page = (window.parent as any).glitter.share.editorViewModel.originalConfig.homePage;
            gvc.notifyDataChange(id);
        }

        getData();

        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return ``;
                    }
                    return html`
                        <div class="position-relative bgf6 d-flex align-items-center justify-content-between border-bottom mt-2 p-2">
                            <span class="fs-lg fw-bold" style="color:black;">SEO設定</span>
                            <button
                                class="btn btn-primary-c fs-6"
                                style="height:40px;"
                                onclick="${gvc.event(() => {
                                    const editData = vm.page_list.find((d1: any) => {
                                        return d1.tag === vm.select_page;
                                    });
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.dataLoading({
                                        visible: true,
                                    });
                                    // page_config
                                    ApiPageConfig.setPage({
                                        id: editData.id,
                                        appName: config.appName,
                                        tag: editData.tag,
                                        name: editData.name,
                                        config: editData.config,
                                        group: editData.group,
                                        page_config: editData.page_config,
                                        page_type: editData.page_type,
                                        preview_image: editData.preview_image,
                                        favorite: editData.favorite,
                                    }).then((api) => {
                                        dialog.dataLoading({ visible: false });
                                        dialog.successMessage({ text: '儲存成功' });
                                    });
                                })}"
                            >
                                儲存
                            </button>
                        </div>
                        ${gvc.bindView(() => {
                            const menuID = gvc.glitter.getUUID();
                            return {
                                bind: menuID,
                                view: () => {
                                    return html`
                                        <div class="mb-2">${EditorElem.h3('選擇頁面')}</div>
                                        <div class="d-flex mb-2">
                                            ${EditorElem.select({
                                                title: '',
                                                gvc: gvc,
                                                def: vm.select_page,
                                                array: vm.page_list
                                                    .filter((data: any) => {
                                                        return data.page_config && data.page_config.support_editor === 'true';
                                                    })
                                                    .map((dd: any) => {
                                                        return { title: dd.name, value: dd.tag };
                                                    }),
                                                callback: (value) => {
                                                    vm.select_page = value;
                                                    gvc.notifyDataChange(id);
                                                },
                                            })}
                                            <div
                                                class="d-flex align-items-center justify-content-center hoverBtn ms-1 me-2 border bg-white
${vm.plugin.homePage === vm.select_page ? `d-none` : ``}"
                                                style="height:43px;width:43px;border-radius:10px;cursor:pointer;color:#151515;"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                data-bs-custom-class="custom-tooltip"
                                                data-bs-title="前往首頁"
                                                onclick="${gvc.event(() => {
                                                    vm.select_page = vm.plugin.homePage;
                                                    gvc.notifyDataChange(id);
                                                })}"
                                            >
                                                <i class="fa-regular fa-house"></i>
                                            </div>
                                        </div>
                                    `;
                                },
                                divCreate: {},
                                onCreate: () => {
                                    $('.tooltip')!.remove();
                                    ($('[data-bs-toggle="tooltip"]') as any).tooltip();
                                },
                            };
                        })}
                        ${gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            return {
                                bind: id,
                                view: () => {
                                    try {
                                        const editData = vm.page_list.find((d1: any) => {
                                            return d1.tag === vm.select_page;
                                        });
                                        editData.page_config.seo = editData.page_config.seo ?? {};
                                        const seo = editData.page_config.seo;
                                        seo.type = seo.type ?? 'def';
                                        if (editData.tag === vm.plugin.homePage) {
                                            seo.type = 'custom';
                                        }
                                        const url = new URL('', vm.plugin.domain ? `https://${vm.plugin.domain}/` : location.href);
                                        url.search = '';
                                        url.searchParams.set('page', glitter.getUrlParameter('page'));
                                        if (!vm.plugin.domain) {
                                            url.searchParams.set('appName', (window as any).appName);
                                        }

                                        return html`
                                            ${BgWidget.card(
                                                [
                                                    html` <div class="fs-sm fw-500 d-flex align-items-center justify-content-between mb-2">搜尋引擎預覽</div>`,
                                                    html` <div class="fs-6 fw-500" style="color:#1a0dab;white-space: normal;">${document.title || '尚未設定'}</div>`,
                                                    BgWidget.greenNote(url.href),
                                                    html` <div class="fs-sm fw-500" style="color:#545454;white-space: normal;">${'desc'}</div>`,
                                                ].join(''),
                                                `p-3 bg-white rounded-3 shadow border  mt-2`
                                            )}
                                            ${editData.page_type === 'page' || editData.page_type === 'blog'
                                                ? EditorElem.select({
                                                      title: '設為首頁',
                                                      gvc: gvc,
                                                      def: vm.plugin.homePage === editData.tag ? `true` : `false`,
                                                      array: [
                                                          { title: '是', value: 'true' },
                                                          { title: '否', value: 'false' },
                                                      ],
                                                      callback: (text) => {
                                                          if (text === 'true') {
                                                              vm.plugin.homePage = editData.tag;
                                                              seo.type = 'custom';
                                                          } else {
                                                              vm.plugin.homePage = undefined;
                                                          }
                                                          gvc.notifyDataChange(id);
                                                      },
                                                  })
                                                : ''}
                                            ${editData.tag === vm.plugin.homePage ? `` : EditorElem.h3('SEO參照')}
                                            <select
                                                class="mt-2 form-select form-control
                                                ${editData.tag === vm.plugin.homePage && 'd-none'}"
                                                onchange="${gvc.event((e) => {
                                                    seo.type = e.value;
                                                    gvc.notifyDataChange(id);
                                                })}"
                                            >
                                                <option value="def" ${seo.type === 'def' ? `selected` : ``}>依照首頁</option>
                                                <option value="custom" ${seo.type === 'custom' ? `selected` : ``}>自定義</option>
                                            </select>
                                            ${seo.type === 'def'
                                                ? ``
                                                : gvc.map([
                                                      uploadImage({
                                                          gvc: gvc,
                                                          title: `網頁logo`,
                                                          def: seo.logo ?? '',
                                                          callback: (data) => {
                                                              seo.logo = data;
                                                          },
                                                      }),
                                                      uploadImage({
                                                          gvc: gvc,
                                                          title: `預覽圖片`,
                                                          def: seo.image ?? '',
                                                          callback: (data) => {
                                                              seo.image = data;
                                                          },
                                                      }),
                                                      EditorElem.editeInput({
                                                          gvc: gvc,
                                                          title: '網頁標題',
                                                          default: seo.title ?? '',
                                                          placeHolder: '請輸入網頁標題',
                                                          callback: (text: string) => {
                                                              seo.title = text;
                                                          },
                                                      }),
                                                      EditorElem.editeText({
                                                          gvc: gvc,
                                                          title: '網頁描述',
                                                          default: seo.content ?? '',
                                                          placeHolder: '請輸入網頁標題',
                                                          callback: (text: string) => {
                                                              seo.content = text;
                                                          },
                                                      }),
                                                      EditorElem.editeText({
                                                          gvc: gvc,
                                                          title: '關鍵字設定',
                                                          default: seo.keywords ?? '',
                                                          placeHolder: '關鍵字設定',
                                                          callback: (text: string) => {
                                                              seo.keywords = text;
                                                          },
                                                      }),
                                                      EditorElem.htmlEditor({
                                                          gvc: gvc,
                                                          title: `自訂代碼區塊`,
                                                          initial: seo.code ?? '',
                                                          callback: (text) => {
                                                              seo.code = text;
                                                          },
                                                          height: 200,
                                                      }),
                                                  ])}
                                        `;
                                    } catch (e) {
                                        return ``;
                                    }
                                },
                                divCreate: () => {
                                    return {
                                        class: ``,
                                        style: ``,
                                    };
                                },
                                onCreate: () => {},
                            };
                        })}
                    `;
                },
                divCreate: {
                    style: `
                        display: flex;
                        flex-direction: column;
                        min-height:calc(100vh);
                        background: whitesmoke;
                        padding: 0 ${window.innerWidth > 768 ? '24%' : '3%'};
                    `,
                },
            };
        });
    }
}

function uploadImage(obj: { title: string; gvc: any; def: string; callback: (data: string) => void }) {
    obj.gvc.addStyle(`
        .p-hover-image:hover {
            opacity: 1 !important;
        }
    `);
    const glitter = (window as any).glitter;
    const id = glitter.getUUID();
    const html = String.raw;
    return obj.gvc.bindView(() => {
        return {
            bind: id,
            view: () => {
                return html`<h3 style="font-size: 15px;margin-bottom: 10px;" class="mt-2 fw-500">${obj.title}</h3>
                    <div class="d-flex align-items-center mb-3">
                        <input
                            class="flex-fill form-control "
                            placeholder="請輸入圖片連結"
                            value="${obj.def}"
                            onchange="${obj.gvc.event((e: any) => {
                                obj.callback(e.value);
                                obj.def = e.value;
                                obj.gvc.notifyDataChange(id);
                            })}"
                        />
                        <div style="width: 1px;height: 25px;background-"></div>
                        <i
                            class="fa-regular fa-upload text-dark ms-2"
                            style="cursor: pointer;"
                            onclick="${obj.gvc.event(() => {
                                glitter.ut.chooseMediaCallback({
                                    single: true,
                                    accept: 'json,image/*',
                                    callback(data: any) {
                                        const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                                        const dialog = new ShareDialog(obj.gvc.glitter);
                                        dialog.dataLoading({ visible: true });
                                        const file = data[0].file;
                                        saasConfig.api.uploadFile(file.name).then((data: any) => {
                                            dialog.dataLoading({ visible: false });
                                            const data1 = data.response;
                                            dialog.dataLoading({ visible: true });
                                            $.ajax({
                                                url: data1.url,
                                                type: 'put',
                                                data: file,
                                                headers: {
                                                    'Content-Type': data1.type,
                                                },
                                                processData: false,
                                                crossDomain: true,
                                                success: (data2) => {
                                                    dialog.dataLoading({ visible: false });
                                                    obj.callback(data1.fullUrl);
                                                    obj.def = data1.fullUrl;
                                                    obj.gvc.notifyDataChange(id);
                                                },
                                                error: (err) => {
                                                    dialog.dataLoading({ visible: false });
                                                    dialog.errorMessage({ text: '上傳失敗' });
                                                },
                                            });
                                        });
                                    },
                                });
                            })}"
                        ></i>
                    </div>
                    ${obj.def &&
                    html` <div
                        class="d-flex align-items-center justify-content-center rounded-3 shadow"
                        style="min-width:100px;width:100px;height:100px;cursor:pointer;background: 50%/cover url('${obj.def}');"
                    >
                        <div
                            class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image"
                            style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                        >
                            <i
                                class="fa-regular fa-eye"
                                onclick="${obj.gvc.event(() => {
                                    obj.gvc.glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', obj.def);
                                })}"
                            ></i>
                        </div>
                    </div>`} `;
            },
            divCreate: {},
        };
    });
}

(window as any).glitter.setModule(import.meta.url, SeoSetting);
