import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { BgWidget } from './bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { Article } from '../glitter-base/route/article.js';
import { MenusSetting } from '../cms-plugin/menus-setting.js';
import { BaseApi } from '../glitterBundle/api/base.js';
import { BgProduct, OptionsItem } from './bg-product.js';
import { CheckInput } from '../modules/checkInput.js';

interface MenuItem {
    link: string;
    title: string;
    items: MenuItem[];
}

const html = String.raw;

export class BgBlog {
    public static contentManager(
        gvc: GVC,
        type: 'select' | 'list' | 'collection' = 'list',
        callback: (list: any[]) => void = () => {},
        is_page: boolean,
        widget: any,
        page_tab: 'page' | 'hidden' | 'shopping'
    ) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm: {
            type: 'list' | 'add' | 'replace' | 'select' | 'collection';
            data: any;
            dataList: any;
            query?: string;
        } = {
            type: 'list',
            data: {},
            dataList: undefined,
            query: '',
        };
        const filterID = gvc.glitter.getUUID();
        let vmi: any = undefined;

        function getDatalist() {
            return vm.dataList.map((dd: any) => {
                return [
                    {
                        key: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: !vm.dataList.find((dd: any) => {
                                return !dd.checked;
                            }),
                            callback: (result) => {
                                vm.dataList.map((dd: any) => {
                                    dd.checked = result;
                                });
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(filterID);
                                callback(
                                    vm.dataList.filter((dd: any) => {
                                        return dd.checked;
                                    })
                                );
                            },
                        }),
                        value: EditorElem.checkBoxOnly({
                            gvc: gvc,
                            def: dd.checked,
                            callback: (result) => {
                                dd.checked = result;
                                vmi.data = getDatalist();
                                vmi.callback();
                                gvc.notifyDataChange(filterID);
                                callback(
                                    vm.dataList.filter((dd: any) => {
                                        return dd.checked;
                                    })
                                );
                            },
                            style: 'height:25px;',
                        }),
                    },
                    {
                        key: `${is_page ? `頁面` : `網誌`}連結`,
                        value: html`<span class="fs-7">${dd.content.tag}</span>`,
                    },
                    {
                        key: `${is_page ? `頁面` : `網誌`}標題`,
                        value: html`<span class="fs-7">${(dd.content.name ?? '尚未設定標題').substring(0, 15)}</span>`,
                    },
                    {
                        key: '發布時間',
                        value: html`<span class="fs-7">${glitter.ut.dateFormat(new Date(dd.created_time), 'yyyy-MM-dd')}</span>`,
                    },
                    {
                        key: '預覽',
                        value: html`
                            <div
                                class="d-flex align-items-center justify-content-center hoverBtn me-2 border"
                                style="height:28px;width:28px;border-radius:5px;cursor:pointer;color:#151515;"
                                onclick="${gvc.event((e, event) => {
                                    const href = (() => {
                                        return `https://${(window.parent as any).glitter.share.editorViewModel.domain}/${
                                                is_page
                                                        ? (() => {
                                                            switch (page_tab) {
                                                                case 'shopping':
                                                                    return 'shop';
                                                                case 'hidden':
                                                                    return 'hidden';
                                                                case 'page':
                                                                    return 'pages';
                                                            }
                                                            return ``;
                                                        })()
                                                        : `blogs`
                                        }/${dd.content.tag}`;
                                    })();
                                    (window.parent as any).glitter.openNewTab(href);
                                    event.stopPropagation()
                                })}"
                            >
                                <i class="fa-regular fa-eye" aria-hidden="true"></i>
                            </div>
                        `,
                    },
                ];
            });
        }

        return gvc.bindView(() => {
            const id = glitter.getUUID();
            return {
                bind: id,
                dataList: [{ obj: vm, key: 'type' }],
                view: () => {
                    if (vm.type === 'list') {
                        return BgWidget.container(
                            html`
                                <div class="d-flex w-100 align-items-center mb-3 ${type === 'select' ? `d-none` : ``}">
                                    <div class="d-flex flex-column" style="gap:5px;">
                                        ${BgWidget.title(
                                            is_page
                                                ? (() => {
                                                      switch (page_tab) {
                                                          case 'hidden':
                                                              return '隱形賣場';
                                                          case 'page':
                                                              return '自訂頁面';
                                                          case 'shopping':
                                                              return '一頁商店';
                                                      }
                                                  })()
                                                : '網誌文章'
                                        )}
                                        ${BgWidget.grayNote(
                                            is_page
                                                ? (() => {
                                                      switch (page_tab) {
                                                          case 'hidden':
                                                              return '隱形賣場僅能透過連結分享，無法顯示於 Google 搜尋列表';
                                                          case 'page':
                                                              return '打造自訂頁面，顯示品牌官網的獨特內容';
                                                          case 'shopping':
                                                              return '放大特定商品重點，打造專屬爆品產品，一頁下單快速購物';
                                                      }
                                                  })()
                                                : '快速分享商店最新資訊的好功能'
                                        )}
                                    </div>
                                    <div class="flex-fill"></div>
                                    <div style="display: flex; gap: 12px;">
                                        ${is_page
                                            ? ''
                                            : BgWidget.grayButton(
                                                  '網誌分類',
                                                  gvc.event(() => {
                                                      vm.type = 'collection';
                                                      gvc.notifyDataChange(id);
                                                  })
                                              )}
                                        ${BgWidget.darkButton(
                                            `新增${is_page ? `頁面` : `網誌`}`,
                                            gvc.event(() => {
                                                vm.data = { content: {} };
                                                vm.type = 'add';
                                            })
                                        )}
                                    </div>
                                </div>
                                ${BgWidget.mainCard(
                                    BgWidget.tableV2({
                                        gvc: gvc,
                                        getData: (vd) => {
                                            vmi = vd;
                                            Article.get({
                                                page: vmi.page - 1,
                                                limit: 20,
                                                search: vm.query || undefined,
                                                for_index: is_page ? `false` : `true`,
                                                status: '0,1',
                                                page_type: page_tab,
                                            }).then((data) => {
                                                vmi.pageSize = Math.ceil(data.response.total / 20);
                                                vm.dataList = data.response.data;
                                                vmi.data = getDatalist();
                                                vmi.loading = false;
                                                vmi.callback();
                                            });
                                        },
                                        rowClick: (data, index) => {
                                            if (type === 'select') {
                                                vm.dataList[index].checked = !vm.dataList[index].checked;
                                                vmi.data = getDatalist();
                                                vmi.callback();
                                                callback(
                                                    vm.dataList.filter((dd: any) => {
                                                        return dd.checked;
                                                    })
                                                );
                                            } else {
                                                vm.data = vm.dataList[index];
                                                vm.type = 'replace';
                                            }
                                        },
                                        filter: html`
                                            ${BgWidget.searchPlace(
                                                gvc.event((e, event) => {
                                                    vm.query = e.value;
                                                    gvc.notifyDataChange(id);
                                                }),
                                                vm.query || '',
                                                '搜尋所有文章'
                                            )}
                                            ${gvc.bindView(() => {
                                                return {
                                                    bind: filterID,
                                                    view: () => {
                                                        if (
                                                            !vm.dataList ||
                                                            !vm.dataList.find((dd: any) => {
                                                                return dd.checked;
                                                            }) ||
                                                            type === 'select'
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
                                                                                        Article.deleteV2({
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
                                                            class: `d-flex mt-2 align-items-center p-2 py-3 ${
                                                                !vm.dataList ||
                                                                !vm.dataList.find((dd: any) => {
                                                                    return dd.checked;
                                                                }) ||
                                                                type === 'select'
                                                                    ? `d-none`
                                                                    : ``
                                                            }`,
                                                            style: ``,
                                                        };
                                                    },
                                                };
                                            })}
                                        `,
                                    })
                                )}
                            `,
                            BgWidget.getContainerWidth()
                        );
                    } else if (vm.type == 'replace') {
                        return editor({
                            gvc: gvc,
                            vm: vm,
                            is_page: is_page,
                            widget: widget,
                            page_tab: page_tab,
                        });
                    } else if (vm.type == 'collection') {
                        return BgWidget.container(
                            setCollection({
                                gvc: gvc,
                                widget: widget,
                                key: 'blog_collection',
                                goBack: () => {
                                    vm.type = 'list';
                                    gvc.notifyDataChange(id);
                                },
                            }),
                            BgWidget.getContainerWidth()
                        );
                    } else {
                        return editor({
                            gvc: gvc,
                            vm: vm,
                            is_page: is_page,
                            widget: widget,
                            page_tab: page_tab,
                        });
                    }
                },
            };
        });
    }

    public static template_select(gvc: GVC, callback: (cf: any) => void, page_tab: 'page' | 'hidden' | 'shopping') {
        let vm = {
            search: '',
        };
        gvc.addStyle(`
            .hoverHidden div {
                display: none;
            }
            .hoverHidden:hover div {
                display: flex;
            }
        `);
        const containerID = gvc.glitter.getUUID();
        return html`<div class="d-flex align-items-center">
                ${BgWidget.goBack(
                    gvc.event(() => {
                        callback(undefined);
                    })
                )}
                <div>${[BgWidget.title('選擇模板'), BgWidget.grayNote('請選擇一個符合您需求的模板')].join('')}</div>
            </div>
            ${[
                html`<div class="my-3"></div>`,
                BgWidget.card(
                    gvc.bindView(() => {
                        return {
                            bind: containerID,
                            view: () => {
                                return gvc.bindView(() => {
                                    let data: any = undefined;
                                    const id = gvc.glitter.getUUID();
                                    if(page_tab!=='page'){
                                        ApiPageConfig.getPageTemplate({
                                            template_from: 'all',
                                            page: '0',
                                            limit: '3000',
                                            type: 'page',
                                            tag: (() => {
                                                switch (page_tab) {
                                                    case 'shopping':
                                                    case 'hidden':
                                                        return `一頁購物`;
                                                    default:
                                                        return ``;
                                                }
                                            })(),
                                            search: vm.search,
                                        }).then((res) => {
                                            data = res;
                                            data.response.result.data = [
                                                {
                                                    id: 20739,
                                                    userID: '234285319',
                                                    tag: 'empty',
                                                    name: '空白內容',
                                                    page_type: 'page',
                                                    preview_image: null,
                                                    appName: 'shop_template_black_style',
                                                    template_type: 2,
                                                    template_config: {
                                                        tag: ['頁面範例'],
                                                        desc: '',
                                                        name: '空白內容',
                                                        image: ['https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709282671899-BLANK PAGE.jpg'],
                                                        status: 'wait',
                                                        post_to: 'all',
                                                        version: '1.0',
                                                        created_by: 'liondesign.io',
                                                        preview_img: '',
                                                    },
                                                },
                                            ].concat(data.response.result.data);
                                            gvc.notifyDataChange(id);
                                        });
                                    }else{
                                        Article.get({
                                            page: 0,
                                            limit: 20,
                                            search: ``,
                                            for_index: `false`,
                                            status: '0,1',
                                            page_type: page_tab,
                                            app_name:'t_1726217714800'
                                        }).then((dd) => {
                                            data= dd.response.data;
                                        })
                                    }
                                   
                                    return {
                                        bind: id,
                                        view: () => {
                                            if (data) {
                                                return (() => {
                                                    if (data.response.result.data.length === 0) {
                                                        if (!vm.search) {
                                                            return html`
                                                                <div class="d-flex align-items-center justify-content-center flex-column w-100 py-4" style="width:700px;gap:10px;">
                                                                    <img src="./img/box-open-solid.svg" />
                                                                    <span class="color39 text-center">尚未自製任何模塊<br />請前往開發者模式自製專屬模塊</span>
                                                                </div>
                                                            `;
                                                        } else {
                                                            return html`
                                                                <div class="d-flex align-items-center justify-content-center flex-column w-100 py-4" style="width:700px;gap:10px;">
                                                                    <img src="./img/box-open-solid.svg" />
                                                                    <span class="color39 text-center">查無相關模塊</span>
                                                                </div>
                                                            `;
                                                        }
                                                    } else {
                                                        return html`
                                                            <div class="w-100" style="overflow-y: auto;">
                                                                <div class="row m-0 pt-2 w-100">
                                                                    ${data.response.result.data
                                                                        .sort((a: any, b: any) => {
                                                                            if (a.tag === 'empty' || b.tag === 'empty') {
                                                                                return b.tag === 'empty' ? 1 : -1;
                                                                            } else {
                                                                                return a.template_config.name.localeCompare(b.template_config.name);
                                                                            }
                                                                        })
                                                                        .map((dd: any, index: number) => {
                                                                            return html`<div class="col-6 col-sm-3 mb-3 rounded-3">
                                                                                <div class="d-flex flex-column justify-content-center w-100 " style="gap:5px;cursor:pointer;">
                                                                                    <div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3" style="padding-bottom: 58%;">
                                                                                        <div
                                                                                            class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                                            style="overflow: hidden;"
                                                                                        >
                                                                                            <img
                                                                                                class="w-100 "
                                                                                                src="${dd.template_config.image[0] ??
                                                                                                'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"
                                                                                            />
                                                                                        </div>

                                                                                        <div
                                                                                            class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                                                            style="background: rgba(0,0,0,0.5);gap:5px;"
                                                                                        >
                                                                                            <button
                                                                                                class="btn btn-secondary d-flex align-items-center "
                                                                                                style="height: 28px;width: 75px;gap:5px;"
                                                                                                onclick="${gvc.event(() => {
                                                                                                    if (dd.tag === 'empty') {
                                                                                                        const a: any = [];
                                                                                                        (a as any).name = '空白頁面';
                                                                                                        callback(a);
                                                                                                    } else {
                                                                                                        BaseApi.create({
                                                                                                            url: `${(window as any).glitterBackend}/api/v1/template?appName=${dd.appName}&tag=${
                                                                                                                dd.tag
                                                                                                            }`,
                                                                                                            type: 'get',
                                                                                                        }).then((res) => {
                                                                                                            res.response.result[0].config.name = dd.template_config.name;
                                                                                                            callback(res.response.result[0].config);
                                                                                                        });
                                                                                                    }
                                                                                                })}"
                                                                                            >
                                                                                                選擇
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    <h3 class="fs-6 mb-0 d-flex justify-content-between align-items-center fw-500 mt-1">
                                                                                        ${dd.template_config.name}
                                                                                        <i
                                                                                            class="fa-solid fa-eye ${dd.tag === 'empty' ? `d-none` : ``}"
                                                                                            style="cursor:pointer;"
                                                                                            onclick="${gvc.event(() => {
                                                                                                (window.parent as any).glitter.openNewTab(
                                                                                                    `${gvc.glitter.root_path}pages/${dd.tag}?appName=${dd.appName}`
                                                                                                );
                                                                                            })}"
                                                                                        ></i>
                                                                                    </h3>
                                                                                </div>
                                                                            </div>`;
                                                                        })
                                                                        .join('')}
                                                                </div>
                                                            </div>
                                                        `;
                                                    }
                                                })();
                                            } else {
                                                return html` <div class="w-100 p-3 d-flex align-items-center justify-content-center flex-column" style="gap: 10px;">
                                                    <div class="spinner-border fs-5"></div>
                                                    <div class="fs-6 fw-500">載入中...</div>
                                                </div>`;
                                            }
                                        },
                                        divCreate: {
                                            style: '',
                                        },
                                    };
                                });
                            },
                            divCreate: {},
                        };
                    })
                ),
            ].join('')} `;
    }
}

function editor(cf: { gvc: GVC; vm: any; is_page: boolean; widget: any; page_tab: 'page' | 'hidden' | 'shopping' }) {
    const vm = cf.vm;
    const gvc = cf.gvc;
    vm.data.content.seo = vm.data.content.seo ?? {};
    vm.data.content.for_index = cf.is_page ? 'false' : 'true';
    if (cf.is_page) {
        vm.data.content.generator = 'page_editor';
    } else {
        vm.data.content.generator = 'rich_text';
    }
    vm.data.content.page_type = vm.data.content.page_type || cf.page_tab;
    let cVm: {
        id: string;
        type: 'detail' | 'collection' | 'template';
    } = {
        id: gvc.glitter.getUUID(),
        type: 'detail',
    };
    return BgWidget.container(
        gvc.bindView(() => {
            return {
                bind: cVm.id,
                view: () => {
                    vm.data.content.collection = (vm.data.content.collection || []).map((dd: any) => {
                        return typeof dd !== 'string' ? dd.link : dd;
                    });
                    switch (cVm.type) {
                        case 'collection':
                            return BgWidget.container(
                                setCollection({
                                    gvc: gvc,
                                    widget: cf.widget,
                                    key: 'blog_collection',
                                    goBack: () => {
                                        cVm.type = 'detail';
                                        gvc.notifyDataChange(cVm.id);
                                    },
                                    select_module: {
                                        callback: (data) => {
                                            vm.data.content.collection = data;
                                            cVm.type = 'detail';
                                            gvc.notifyDataChange(cVm.id);
                                        },
                                        def: vm.data.content.collection || [],
                                    },
                                }),
                                BgWidget.getContainerWidth()
                            );
                        case 'detail':
                            return detail(gvc, cf, vm, cVm, cf.page_tab);
                        case 'template':
                            return template_select(gvc, cf, vm, cVm, cf.page_tab);
                        default:
                            return ``;
                    }
                },
                divCreate: {},
            };
        }),
        BgWidget.getContainerWidth()
    );
}

//頁面編輯畫面
function detail(gvc: GVC, cf: any, vm: any, cVm: any, page_tab: 'page' | 'hidden' | 'shopping') {
    vm.data.content.tag = vm.data.content.tag || `${new Date().getTime()}`;
    if (!vm.data.id && cf.is_page) {
        setTimeout(() => {
            cVm.type = 'template';
            vm.data.content.template = 'article';
            gvc.notifyDataChange(cVm.id);
        }, 100);
        return ``;
    }
    return html`
        <div class="d-flex w-100 align-items-center mb-3 ">
            ${BgWidget.goBack(
                gvc.event(() => {
                    vm.type = 'list';
                })
            )}
            ${BgWidget.title(
                cf.is_page
                    ? (() => {
                          switch (page_tab) {
                              case 'hidden':
                                  return '隱形賣場';
                              case 'page':
                                  return '自訂頁面';
                              case 'shopping':
                                  return '一頁商店';
                          }
                      })()
                    : '編輯網誌'
            )}
            <div class="flex-fill"></div>
            <div class="d-flex ${cf.is_page ? `` : `d-none`}">
                ${BgWidget.grayButton(
                    '套用模板',
                    gvc.event(() => {
                        cVm.type = 'template';
                        gvc.notifyDataChange(cVm.id);
                    })
                )}
                <div class="mx-1"></div>
                ${BgWidget.grayButton(
                    '前往設計',
                    gvc.event(() => {
                        (window.parent as any).glitter.innerDialog(
                            (gvc: GVC) => {
                                return gvc.bindView(() => {
                                    const id = gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return html` <iframe
                                                class="rounded-3"
                                                id="editor_dialog"
                                                src="${(() => {
                                                    const url = new URL(window.parent.location.href);
                                                    url.searchParams.set('function', 'user-editor');
                                                    return url.href;
                                                })()}"
                                            ></iframe>`;
                                        },
                                        divCreate: {
                                            class: `vw-100 vh-100 p-2`,
                                            style: `background: rgba(0,0,0,0.5);`,
                                        },
                                        onCreate: () => {
                                            const interval = setInterval(() => {
                                                const iframe: any = window.parent.document.querySelector('#editor_dialog')!;
                                                if (iframe.contentWindow.glitter) {
                                                    iframe.contentWindow.glitter.share.editor_vm = {
                                                        close: () => {
                                                            gvc.closeDialog();
                                                        },
                                                        callback: (cf: any) => {
                                                            vm.data.content.config = cf.config;
                                                            saveData(gvc, cf, vm, cVm, true);
                                                        },
                                                        page_data: {
                                                            config: JSON.parse(JSON.stringify(vm.data.content.config || [])),
                                                            page_config: {},
                                                            name: vm.data.content.name || '尚未設定頁面標題',
                                                        },
                                                        title: vm.data.content.name || '尚未設定頁面標題',
                                                    };
                                                    clearInterval(interval);
                                                }
                                            }, 100);
                                        },
                                    };
                                });
                            },
                            '',
                            {
                                dismiss: () => {},
                            }
                        );
                    })
                )}
            </div>
        </div>
        ${BgWidget.container(
            html`
                <div class="d-flex justify-content-center p-0 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="gap: 24px">
                    <div class="d-flex flex-column " style="gap:10px;${document.body.clientWidth > 768 ? 'width: 73.5%;' : ''}">
                        ${BgWidget.container(
                            gvc.bindView(() => {
                                vm.data.status = vm.data.status ?? 1;
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        return [
                                            BgWidget.mainCard(
                                                (() => {
                                                    const prefixURL = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/${
                                                        cf.is_page
                                                            ? (() => {
                                                                  switch (page_tab) {
                                                                      case 'shopping':
                                                                          return 'shop';
                                                                      case 'hidden':
                                                                          return 'hidden';
                                                                      case 'page':
                                                                          return 'pages';
                                                                      default:
                                                                          return '';
                                                                  }
                                                              })()
                                                            : 'blogs'
                                                    }/`;
                                                    return [
                                                        BgWidget.title('基本設定', 'font-size: 16px;'),
                                                        html` <div style="display: flex; align-items: center; gap: 4px; margin: 18px 0;">
                                                            <div class="tx_normal">網頁啟用</div>
                                                            ${BgWidget.switchButton(gvc, vm.data.status, (bool) => {
                                                                vm.data.status = bool ? 1 : 0;
                                                                gvc.notifyDataChange(id);
                                                            })}
                                                        </div>`,
                                                        BgWidget.editeInput({
                                                            gvc: gvc,
                                                            title: '網頁名稱',
                                                            default: vm.data.content.name || '',
                                                            placeHolder: '請輸入網頁名稱',
                                                            callback: (text) => {
                                                                vm.data.content.name = text;
                                                            },
                                                        }),
                                                        html` <div>
                                                            <div class="tx_normal fw-normal mb-2">自訂網址</div>
                                                            <div
                                                                style="justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                                                    .body.clientWidth > 768
                                                                    ? 'gap: 18px; '
                                                                    : 'flex-direction: column; gap: 0px; '}"
                                                                class="w-100"
                                                            >
                                                                <div style="padding: 9px 18px;background: #EAEAEA; justify-content: center; align-items: center; gap: 5px; display: flex">
                                                                    <div style="text-align: right; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                        ${prefixURL}
                                                                    </div>
                                                                </div>
                                                                <input
                                                                    class="flex-fill"
                                                                    style="width:100%;border:none;background:none;text-align: start; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word; ${document
                                                                        .body.clientWidth > 768
                                                                        ? ''
                                                                        : 'padding: 9px 18px;'}"
                                                                    value="${vm.data.content.tag || ''}"
                                                                    onchange="${gvc.event((e) => {
                                                                        let text = e.value;
                                                                        if (!CheckInput.isEnglishNumberHyphen(text)) {
                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                            dialog.infoMessage({ text: '僅能輸入英文或數字與連接號' });
                                                                            gvc.notifyDataChange(id);
                                                                        } else {
                                                                            vm.data.content.tag = text;
                                                                            gvc.notifyDataChange(id);
                                                                        }
                                                                    })}"
                                                                />
                                                            </div>
                                                        </div>`,
                                                        html` <div class="mt-2 mb-1"><span class="tx_normal me-2">網址預覽</span>${BgWidget.greenNote(prefixURL + (vm.data.content.tag ?? ''))}</div>`,
                                                        ...(() => {
                                                            return [
                                                                BgWidget.editeInput({
                                                                    gvc: gvc,
                                                                    title: 'SEO標題',
                                                                    default: vm.data.content.seo.title,
                                                                    placeHolder: `請輸入SEO標題`,
                                                                    callback: (text) => {
                                                                        vm.data.content.title = text;
                                                                        vm.data.content.seo.title = text;
                                                                        gvc.notifyDataChange(id);
                                                                    },
                                                                }),
                                                                BgWidget.textArea({
                                                                    gvc: gvc,
                                                                    title: 'SEO描述',
                                                                    default: vm.data.content.seo.content,
                                                                    placeHolder: `請輸入中繼描述`,
                                                                    callback: (text) => {
                                                                        vm.data.content.description = text;
                                                                        vm.data.content.seo.content = text;
                                                                        gvc.notifyDataChange(id);
                                                                    },
                                                                }),
                                                                html` <div>
                                                                    <div class="tx_normal">社群分享縮圖</div>
                                                                    <div class="mt-1 mb-2">${BgWidget.grayNote('建議尺寸為 200px * 200px 以上')}</div>
                                                                    ${BgWidget.imageSelector(gvc, vm.data.content.seo.image || '', (text) => {
                                                                        vm.data.content.seo.image = text;
                                                                        gvc.notifyDataChange(id);
                                                                    })}
                                                                </div>`,
                                                                ,
                                                            ];
                                                        })(),
                                                        ...(() => {
                                                            if (`${vm.data.content.for_index}` === 'true') {
                                                                return [
                                                                    [
                                                                        html`<div class="tx_normal my-3">網誌內文</div>`,
                                                                        EditorElem.richText({
                                                                            gvc: gvc,
                                                                            def: vm.data.content.text ?? '',
                                                                            callback: (text) => {
                                                                                vm.data.content.text = text;
                                                                            },
                                                                        }),
                                                                    ].join(BgWidget.mbContainer(12)),
                                                                ];
                                                            } else {
                                                                return [];
                                                            }
                                                        })(),
                                                    ].join(BgWidget.mbContainer(12));
                                                })()
                                            ),
                                        ].join('');
                                    },
                                    divCreate: {
                                        style: 'padding: 0;',
                                    },
                                };
                            }),
                            undefined,
                            'padding: 0 !important; margin: 0 !important; width: 100%;'
                        )}
                        ${(() => {
                            vm.data.content.relative = vm.data.content.relative || 'collection';
                            vm.data.content.relative_data = vm.data.content.relative_data || [];
                            vm.data.content.with_discount = vm.data.content.with_discount || 'false';

                            return gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                return {
                                    bind: id,
                                    view: () => {
                                        // 顯示套用的賣場商品列表
                                        if (vm.data.content.page_type === 'hidden' || vm.data.content.page_type === 'shopping') {
                                            return [
                                                BgWidget.mainCard(
                                                    [
                                                        BgWidget.title(
                                                            html`預設加入購物車
                                                                <div class="badge ms-2" style="background:#eaeaea;color:#393939;">以下設定的商品會自動加入購物車</div>`,
                                                            'font-size: 16px;'
                                                        ),
                                                        html`<div class="my-2"></div>`,
                                                        [
                                                            html`${(() => {
                                                                return gvc.bindView(() => {
                                                                    const subVM = {
                                                                        id: gvc.glitter.getUUID(),
                                                                        loading: true,
                                                                        dataList: [] as OptionsItem[],
                                                                    };
                                                                    return {
                                                                        bind: subVM.id,
                                                                        view: () => {
                                                                            if (subVM.loading) {
                                                                                return BgWidget.spinner();
                                                                            }
                                                                            return html`
                                                                                <div class="d-flex flex-column p-2" style="gap: 18px;">
                                                                                    <div class="d-flex align-items-center gray-bottom-line-18 " style="gap: 24px; justify-content: space-between;">
                                                                                        <div class="form-check-label c_updown_label">
                                                                                            <div class="tx_normal">產品列表</div>
                                                                                        </div>
                                                                                        ${BgWidget.grayButton(
                                                                                            '搜尋商品',
                                                                                            gvc.event(() => {
                                                                                                BgProduct.variantsSelector({
                                                                                                    gvc: gvc,
                                                                                                    filter_variants: vm.data.content.relative_data.map((dd: any) => {
                                                                                                        return [dd.product_id].concat(dd.variant.spec).join('-');
                                                                                                    }),
                                                                                                    callback: async (value) => {
                                                                                                        vm.data.content.relative_data = value.map((dd: any) => {
                                                                                                            return {
                                                                                                                variant: dd.variant_content,
                                                                                                                product_id: dd.product_id,
                                                                                                            };
                                                                                                        });
                                                                                                        subVM.loading = true;
                                                                                                        gvc.notifyDataChange(subVM.id);
                                                                                                    },
                                                                                                });
                                                                                            }),
                                                                                            { textStyle: 'font-weight: 400;' }
                                                                                        )}
                                                                                    </div>
                                                                                    ${subVM.dataList
                                                                                        .map((opt: OptionsItem, index) => {
                                                                                            return html`
                                                                                                <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                                    <span class="tx_normal" style="min-width: 20px;">${index + 1} .</span>
                                                                                                    ${BgWidget.validImageBox({ gvc: gvc, image: opt.image, width: 40 })}
                                                                                                    <div class="tx_normal ${opt.note ? 'mb-1' : ''} d-flex flex-column">
                                                                                                        ${opt.value} ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                                                                    </div>
                                                                                                    <div class="flex-fill"></div>
                                                                                                    ${BgWidget.cancel(
                                                                                                        gvc.event(() => {
                                                                                                            vm.data.content.relative_data.splice(index, 1);
                                                                                                            subVM.dataList.splice(index, 1);
                                                                                                            gvc.notifyDataChange(subVM.id);
                                                                                                        }),
                                                                                                        '移除'
                                                                                                    )}
                                                                                                </div>
                                                                                            `;
                                                                                        })
                                                                                        .join('') || `<div class="w-100 d-flex align-content-center justify-content-center">尚未加入任何賣場商品</div>`}
                                                                                </div>
                                                                            `;
                                                                        },
                                                                        onCreate: () => {
                                                                            if (subVM.loading) {
                                                                                if (vm.data.content.relative_data.length === 0) {
                                                                                    setTimeout(() => {
                                                                                        subVM.dataList = [];
                                                                                        subVM.loading = false;
                                                                                        gvc.notifyDataChange(subVM.id);
                                                                                    }, 300);
                                                                                } else {
                                                                                    new Promise<OptionsItem[]>(async (resolve) => {
                                                                                        const products_data = await BgProduct.getProductOpts(
                                                                                            vm.data.content.relative_data.map((dd: any) => {
                                                                                                return dd.product_id;
                                                                                            })
                                                                                        );
                                                                                        vm.data.content.relative_data = vm.data.content.relative_data.filter((dd: any) => {
                                                                                            return products_data.find((d1) => {
                                                                                                return `${dd.product_id}` === `${d1.key}`;
                                                                                            });
                                                                                        });
                                                                                        subVM.dataList = vm.data.content.relative_data.map((dd: any) => {
                                                                                            const product: any = JSON.parse(
                                                                                                JSON.stringify(
                                                                                                    products_data.find((d1) => {
                                                                                                        return `${dd.product_id}` === `${d1.key}`;
                                                                                                    })
                                                                                                )
                                                                                            );
                                                                                            product.note = dd.variant.spec.join(' / ');
                                                                                            return product;
                                                                                        });
                                                                                        resolve(subVM.dataList);
                                                                                    }).then((data) => {
                                                                                        subVM.dataList = data;
                                                                                        subVM.loading = false;
                                                                                        gvc.notifyDataChange(subVM.id);
                                                                                    });
                                                                                }
                                                                            }
                                                                        },
                                                                    };
                                                                });
                                                            })()}`,
                                                        ].join(''),
                                                    ].join('')
                                                ),
                                            ].join('');
                                        } else {
                                            return [].join('');
                                        }
                                    },
                                    divCreate: {
                                        class: `w-100 mt-2`,
                                    },
                                };
                            });
                        })()}
                    </div>
                    ${BgWidget.container(
                        BgWidget.mainCard(
                            gvc.bindView(() => {
                                const id = gvc.glitter.getUUID();
                                vm.data.status = vm.data.status ?? '1';
                                return {
                                    bind: id,
                                    view: () => {
                                        return [
                                            cf.is_page
                                                ? ``
                                                : EditorElem.select({
                                                      title: '啟用狀態',
                                                      gvc: gvc,
                                                      def: `${vm.data.status}`,
                                                      array: [
                                                          {
                                                              title: '啟用',
                                                              value: '1',
                                                          },
                                                          {
                                                              title: '隱藏',
                                                              value: '0',
                                                          },
                                                      ],
                                                      callback: (text: string) => {
                                                          vm.data.status = text;
                                                          gvc.notifyDataChange(id);
                                                      },
                                                  }),
                                            EditorElem.pageSelect(
                                                gvc,
                                                '選擇佈景主題',
                                                vm.data.content.template ?? '',
                                                (data) => {
                                                    vm.data.content.template = data;
                                                },
                                                (dd) => {
                                                    const filter_result = dd.group !== 'glitter-article' && dd.page_type === 'article' && dd.page_config.template_type === 'blog';
                                                    if (filter_result && !vm.data.content.template) {
                                                        vm.data.content.template = dd.tag;
                                                        gvc.notifyDataChange(id);
                                                    }
                                                    return filter_result;
                                                }
                                            ),
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '作者名稱',
                                                default: vm.data.content.author,
                                                placeHolder: '請輸入作者名稱',
                                                callback: (text) => {
                                                    vm.data.content.author = text;
                                                },
                                            }),
                                            gvc.bindView(() => {
                                                const id = gvc.glitter.getUUID();
                                                return {
                                                    bind: id,
                                                    view: () => {
                                                        if (cf.is_page) {
                                                            return ``;
                                                        }
                                                        vm.data.content.collection = vm.data.content.collection ?? [];
                                                        return [
                                                            html` <div class="d-flex align-items-center my-3" style="gap: 10px;">
                                                                ${EditorElem.h3('預覽圖')}
                                                                ${BgWidget.grayButton(
                                                                    '添加檔案',
                                                                    gvc.event(() => {
                                                                        EditorElem.uploadFileFunction({
                                                                            gvc: gvc,
                                                                            callback: (text) => {
                                                                                vm.data.content.preview_image = text;
                                                                                gvc.notifyDataChange(id);
                                                                            },
                                                                            type: `image/*, video/*`,
                                                                        });
                                                                    })
                                                                )}
                                                            </div>`,
                                                            EditorElem.flexMediaManager({
                                                                gvc: gvc,
                                                                data: vm.data.content.preview_image ? [vm.data.content.preview_image] : [],
                                                            }),
                                                            (() => {
                                                                if (cf.is_page) {
                                                                    return ``;
                                                                }
                                                                return html`
                                                                    ${EditorElem.h3('文章分類')}
                                                                    ${gvc.bindView(() => {
                                                                        const tagID = gvc.glitter.getUUID();
                                                                        let listTag: string[] = [];
                                                                        ApiUser.getPublicConfig('blog_collection', 'manager').then((data: any) => {
                                                                            if (data.response.value) {
                                                                                vm.link = data.response.value;

                                                                                function setCheck(link: MenuItem[]) {
                                                                                    link.map((dd) => {
                                                                                        const it = vm.data.content.collection.find((d1: string) => {
                                                                                            return d1 === dd.link;
                                                                                        });
                                                                                        it && listTag.push(dd.title);
                                                                                        setCheck(dd.items);
                                                                                    });
                                                                                }

                                                                                setCheck(vm.link);

                                                                                gvc.notifyDataChange(tagID);
                                                                            }
                                                                        });
                                                                        return {
                                                                            bind: tagID,
                                                                            view: () => {
                                                                                return listTag
                                                                                    .map((dd: any) => {
                                                                                        return html` <div class="badge bg_orange  mt-2 me-2 fs-sm">${dd}</div>`;
                                                                                    })
                                                                                    .join('');
                                                                            },
                                                                            divCreate: {
                                                                                class: `d-flex flex-wrap`,
                                                                            },
                                                                        };
                                                                    })}
                                                                    <div
                                                                        class="cursor_pointer bt_c39 ms-2 p-1 mt-3"
                                                                        onclick="${gvc.event(() => {
                                                                            cVm.type = 'collection';
                                                                            gvc.notifyDataChange(cVm.id);
                                                                        })}"
                                                                    >
                                                                        <i class="fa-solid fa-plus me-2" aria-hidden="true"></i>
                                                                        添加與編輯分類
                                                                    </div>
                                                                `;
                                                            })(),
                                                        ].join(`<div class="my-2"></div>`);
                                                    },
                                                    divCreate: {},
                                                };
                                            }),
                                        ].join('');
                                    },
                                };
                            })
                        ),
                        undefined,
                        'padding: 0 !important; margin: 0 !important; width: 26.5%;'
                    )}
                </div>
            `,
            undefined,
            'padding: 0 !important;'
        )}
        ${BgWidget.mbContainer(240)}
        <div class="update-bar-container">
            ${vm.data.id
                ? BgWidget.redButton(
                      `刪除${cf.is_page ? '頁面' : '網誌'}`,
                      gvc.event(() => {
                          const dialog = new ShareDialog(gvc.glitter);
                          dialog.checkYesOrNot({
                              text: '是否確認刪除此頁面?',
                              callback: async (response) => {
                                  if (response) {
                                      await cf.widget.event('loading', {
                                          title: '刪除中...',
                                      });
                                      Article.deleteV2({
                                          id: `${vm.data.id}`,
                                      }).then(async (res) => {
                                          await cf.widget.event('loading', {
                                              title: '刪除中...',
                                              visible: false,
                                          });
                                          if (res.result) {
                                              vm.dataList = undefined;
                                              vm.type = 'list';
                                          } else {
                                              await cf.widget.event('error', {
                                                  title: '刪除失敗',
                                                  visible: false,
                                              });
                                          }
                                      });
                                  }
                              },
                          });
                      })
                  )
                : ''}
            ${BgWidget.cancel(
                gvc.event(() => {
                    if (!vm.data.id) {
                        cf.widget.event('error', {
                            title: '請先儲存',
                        });
                    } else {
                        const href = (() => {
                            return `https://${(window.parent as any).glitter.share.editorViewModel.domain}/${
                                cf.is_page
                                    ? (() => {
                                          switch (page_tab) {
                                              case 'shopping':
                                                  return 'shop';
                                              case 'hidden':
                                                  return 'hidden';
                                              case 'page':
                                                  return 'pages';
                                          }
                                          return ``;
                                      })()
                                    : `blogs`
                            }/${vm.data.content.tag}`;
                        })();
                        (window.parent as any).glitter.openNewTab(href);
                    }
                }),
                '預覽'
            )}
            ${BgWidget.cancel(
                gvc.event(() => {
                    vm.type = 'list';
                }),
                '取消'
            )}
            ${BgWidget.save(
                gvc.event(async () => {
                    saveData(gvc, cf, vm, cVm, false);
                })
            )}
        </div>
    `;
}

async function saveData(gvc: GVC, cf: any, vm: any, cVm: any, silence: boolean) {
    if (!vm.data.content.tag) {
        await cf.widget.event('error', {
            title: '請設定連結',
        });
    } else if (!vm.data.content.name) {
        await cf.widget.event('error', {
            title: '請設定名稱',
        });
    } else {
        if (!silence) {
            await cf.widget.event('loading', {
                title: '儲存中...',
            });
        }

        if (vm.data.id) {
            Article.put(vm.data).then(async (res) => {
                await cf.widget.event('loading', {
                    title: '儲存中...',
                    visible: false,
                });
                if (res.result) {
                    await cf.widget.event('success', {
                        title: '設定成功',
                    });
                } else {
                    await cf.widget.event('error', {
                        title: '此連結已被使用',
                    });
                }
            });
        } else {
            await cf.widget.event('loading', {
                title: '儲存中...',
            });
            Article.post(vm.data.content, vm.data.status).then(async (res) => {
                await cf.widget.event('loading', {
                    title: '儲存中...',
                    visible: false,
                });
                if (res.result) {
                    vm.data.id = res.response.result;
                    if (!silence) {
                        await cf.widget.event('success', {
                            title: '新增成功',
                        });
                    }
                    cVm.type = 'detail';
                    gvc.notifyDataChange(cVm.id);
                } else {
                    await cf.widget.event('error', {
                        title: '此連結已被使用',
                    });
                }
            });
        }
    }
}

//分類選擇頁面
function setCollection(cf: {
    goBack: () => void;
    gvc: GVC;
    widget: any;
    key: string;
    select_module?: {
        callback: (data: any) => void;
        def: string[];
    };
}) {
    const vm: {
        id: string;
        link: MenuItem[];
        loading: boolean;
        selected: boolean;
    } = {
        id: cf.gvc.glitter.getUUID(),
        link: [],
        selected: false,
        loading: true,
    };

    ApiUser.getPublicConfig(cf.key, 'manager').then((data: any) => {
        if (data.response.value) {
            vm.link = data.response.value;
            if (cf.select_module) {
                function setCheck(link: MenuItem[]) {
                    link.map((dd, value) => {
                        if (
                            cf.select_module!.def.find((d1) => {
                                return d1 === dd.link;
                            })
                        ) {
                            (dd as any).selected = true;
                        }
                        setCheck(dd.items);
                    });
                }

                setCheck(vm.link);
            }
            gvc.notifyDataChange(vm.id);
        }
    });

    function clearNoNeedData(items: MenuItem[]) {
        items.map((dd) => {
            (dd as any).selected = undefined;
            clearNoNeedData(dd.items || []);
        });
    }

    function save() {
        let select_list: any = [];

        function check_select(items: MenuItem[]) {
            items.map((dd) => {
                if ((dd as any).selected) {
                    select_list.push(dd.link);
                }
            });
        }

        check_select(vm.link);
        clearNoNeedData(vm.link);
        cf.widget.event('loading', {
            title: '儲存中...',
        });
        ApiUser.setPublicConfig({
            key: cf.key,
            value: vm.link,
            user_id: 'manager',
        }).then((data) => {
            setTimeout(() => {
                cf.widget.event('loading', {
                    visible: false,
                });
                if (cf.select_module) {
                    cf.select_module.callback(select_list);
                } else {
                    cf.widget.event('success', {
                        title: '儲存成功',
                    });
                }
            }, 1000);
        });
    }

    function selectAll(array: MenuItem) {
        (array as any).selected = true;
        array.items.map((dd) => {
            (dd as any).selected = true;
            selectAll(dd);
        });
    }

    function clearAll(array: MenuItem) {
        (array as any).selected = false;
        array.items.map((dd) => {
            (dd as any).selected = false;
            clearAll(dd);
        });
    }

    function allSelect(dd: any) {
        return (
            !dd.items.find((d1: any) => {
                return !(d1 as any).selected;
            }) && (dd as any).selected
        );
    }

    function getSelectCount(dd: any) {
        let count = 0;
        if (dd.selected) {
            count++;
        }
        dd.items.map((d1: any) => {
            count += getSelectCount(d1);
        });
        return count;
    }

    function deleteSelect(items: MenuItem[]) {
        return items.filter((d1) => {
            d1.items = deleteSelect(d1.items || []);
            return !(d1 as any).selected;
        });
    }

    function checkLinkExists(it: MenuItem, items: MenuItem[]) {
        let exists_count = -1;
        let title_exists_count = -1;

        function check(it: MenuItem, items: MenuItem[]) {
            items.map((d1) => {
                if (d1.link === it.link) {
                    exists_count++;
                }
                if (d1.title === it.title) {
                    title_exists_count++;
                }
                return check(it, d1.items);
            });
        }

        check(it, items);
        const dialog = new ShareDialog(gvc.glitter);
        if (!it.link || !it.title) {
            dialog.infoMessage({ text: '請確實填寫欄位內容' });
            return false;
        } else if (exists_count) {
            dialog.infoMessage({ text: '此標籤已被使用' });
            return false;
        } else if (title_exists_count) {
            dialog.infoMessage({ text: '此標題已被使用' });
            return false;
        } else {
            return true;
        }
    }

    const gvc = cf.gvc;
    return gvc.bindView(() => {
        return {
            bind: vm.id,
            view: () => {
                return html` <div class="d-flex align-items-center my-3">
                        ${BgWidget.goBack(
                            cf.gvc.event(() => {
                                cf.goBack();
                            })
                        )}${BgWidget.title('分類設定')}
                    </div>
                    <div
                        style="max-width:100%;width: 856px; padding: 20px; background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); border-radius: 10px; overflow: hidden; justify-content: center; align-items: center; display: inline-flex"
                    >
                        <div style="width: 100%;  position: relative">
                            <div style="width: 100%;  left: 0px; top: 0px;  flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                <div
                                    class="w-100  ${getSelectCount({
                                        items: vm.link,
                                    }) > 0
                                        ? ``
                                        : `d-none`}"
                                    style="height: 40px; padding: 12px 18px;background: #F7F7F7; border-radius: 10px; justify-content: flex-end; align-items: center; gap: 8px; display: inline-flex"
                                >
                                    <div style="flex: 1 1 0; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">
                                        已選取${getSelectCount({
                                            items: vm.link,
                                        })}項
                                    </div>
                                    <div
                                        style="cursor:pointer;padding: 4px 14px;background: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10); border-radius: 20px; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                                    >
                                        <div
                                            style="color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                                            onclick="${gvc.event(() => {
                                                vm.link = deleteSelect(vm.link);
                                                gvc.notifyDataChange(vm.id);
                                            })}"
                                        >
                                            刪除
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center" style="width: 100%; height: 22px; position: relative;gap:29px;">
                                    <div
                                        class="${allSelect({
                                            items: vm.link,
                                            selected: !vm.link.find((dd) => {
                                                return !(dd as any).selected;
                                            }),
                                        })
                                            ? `fa-solid fa-square-check`
                                            : `fa-regular fa-square`}"
                                        style="color:#393939;width: 16px; height: 16px;cursor: pointer;"
                                        onclick="${cf.gvc.event((e, event) => {
                                            event.stopPropagation();

                                            if (
                                                vm.link.find((dd) => {
                                                    return !(dd as any).selected;
                                                })
                                            ) {
                                                selectAll({
                                                    items: vm.link,
                                                } as any);
                                            } else {
                                                clearAll({
                                                    items: vm.link,
                                                } as any);
                                            }
                                            gvc.notifyDataChange(vm.id);
                                        })}"
                                    ></div>
                                    <div style="left: 61px; top: 0px;  color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word">選單名稱</div>
                                </div>
                                <div style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 18px; display: flex">
                                    ${(() => {
                                        function renderItems(array: MenuItem[]): string {
                                            const id = gvc.glitter.getUUID();
                                            return (
                                                gvc.bindView(() => {
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return array
                                                                .map((dd, index) => {
                                                                    dd.items;
                                                                    const list = html`
                                                                        <div
                                                                            class=" w-100 "
                                                                            style="width: 100%; justify-content: flex-start; align-items: center; gap: 5px; display: inline-flex;cursor: pointer;"
                                                                            onclick="${cf.gvc.event(() => {
                                                                                if (dd.items && dd.items.length > 0) {
                                                                                    (dd as any).toggle = !(dd as any).toggle;
                                                                                    gvc.notifyDataChange(vm.id);
                                                                                }
                                                                            })}"
                                                                        >
                                                                            <div
                                                                                class="${allSelect(dd) ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                style="color:#393939;width: 16px; height: 16px;"
                                                                                onclick="${cf.gvc.event((e, event) => {
                                                                                    event.stopPropagation();
                                                                                    (dd as any).selected = !(dd as any).selected;
                                                                                    if ((dd as any).selected) {
                                                                                        selectAll(dd);
                                                                                    } else {
                                                                                        clearAll(dd);
                                                                                    }
                                                                                    gvc.notifyDataChange(vm.id);
                                                                                })}"
                                                                            ></div>
                                                                            <div class="hoverF2 pe-2" style="width: 100%;  justify-content: flex-start; align-items: center; gap: 8px; display: flex">
                                                                                <i
                                                                                    class="ms-2 fa-solid fa-grip-dots-vertical color39 dragItem hoverBtn d-flex align-items-center justify-content-center"
                                                                                    style="cursor: pointer;width:25px;height: 25px;"
                                                                                ></i>
                                                                                <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px; display: inline-flex">
                                                                                    <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                                                                        <div style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                                            ${dd.title}
                                                                                        </div>
                                                                                        ${dd.items && dd.items.length > 0
                                                                                            ? !(dd as any).toggle
                                                                                                ? `<i class="fa-solid fa-angle-down color39"></i>`
                                                                                                : `<i class="fa-solid fa-angle-up color39"></i>`
                                                                                            : ``}
                                                                                    </div>
                                                                                    <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                                                                        <div
                                                                                            style="color: #3366BB; font-size: 14px; font-family: Noto Sans; font-weight: 400; line-height: 14px; word-wrap: break-word"
                                                                                        >
                                                                                            ${dd.title}
                                                                                        </div>
                                                                                        <div style="color: #159240; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                                            ${dd.link}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="flex-fill"></div>
                                                                                <div
                                                                                    class="child me-2"
                                                                                    onclick="${cf.gvc.event((e, event) => {
                                                                                        event.stopPropagation();
                                                                                        MenusSetting.collectionEvent(
                                                                                            {
                                                                                                link: '',
                                                                                                title: '',
                                                                                                items: [],
                                                                                            },
                                                                                            (data) => {
                                                                                                dd.items = dd.items || [];
                                                                                                dd.items.push(data);
                                                                                                if (checkLinkExists(data, vm.link)) {
                                                                                                    gvc.notifyDataChange(vm.id);
                                                                                                    return true;
                                                                                                } else {
                                                                                                    dd.items.splice(dd.items.length - 1, 1);
                                                                                                    return false;
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    })}"
                                                                                >
                                                                                    <i class="fa-solid fa-plus" style="color:#393939;"></i>
                                                                                </div>
                                                                                <div
                                                                                    class="child"
                                                                                    onclick="${cf.gvc.event((e, event) => {
                                                                                        event.stopPropagation();
                                                                                        const og = JSON.parse(JSON.stringify(dd));

                                                                                        MenusSetting.collectionEvent(dd, (data) => {
                                                                                            if (checkLinkExists(data, vm.link)) {
                                                                                                array[index] = data;
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                                return true;
                                                                                            } else {
                                                                                                data.link = og.link;
                                                                                                data.title = og.title;
                                                                                                return false;
                                                                                            }
                                                                                        });
                                                                                    })}"
                                                                                >
                                                                                    <i class="fa-solid fa-pencil" style="color:#393939;"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        ${dd.items && dd.items.length > 0
                                                                            ? html`
                                                                                  <div class=" w-100 ${(dd as any).toggle ? `` : `d-none`}" style="padding-left: 35px;">
                                                                                      ${renderItems(dd.items as MenuItem[]) as any}
                                                                                  </div>
                                                                              `
                                                                            : ``}
                                                                    `;
                                                                    return html` <li class="w-100 ">${list}</li>`;
                                                                })
                                                                .join('');
                                                        },
                                                        divCreate: {
                                                            elem: 'ul',
                                                            class: `w-100 my-2`,
                                                            style: `display:flex;flex-direction: column;gap:18px;`,
                                                        },
                                                        onCreate: () => {
                                                            gvc.glitter.addMtScript(
                                                                [
                                                                    {
                                                                        src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                                    },
                                                                ],
                                                                () => {},
                                                                () => {}
                                                            );
                                                            const interval = setInterval(() => {
                                                                //@ts-ignore
                                                                if (window.Sortable) {
                                                                    try {
                                                                        gvc.addStyle(`
                                                                            ul {
                                                                                list-style: none;
                                                                                padding: 0;
                                                                            }
                                                                        `);

                                                                        function swapArr(arr: any, index1: number, index2: number) {
                                                                            const data = arr[index1];
                                                                            arr.splice(index1, 1);
                                                                            arr.splice(index2, 0, data);
                                                                        }

                                                                        let startIndex = 0;
                                                                        //@ts-ignore
                                                                        Sortable.create(gvc.getBindViewElem(id).get(0), {
                                                                            group: id,
                                                                            animation: 100,
                                                                            handle: '.dragItem',
                                                                            onChange: function (evt: any) {},
                                                                            onEnd: (evt: any) => {
                                                                                swapArr(array, startIndex, evt.newIndex);
                                                                                gvc.notifyDataChange(id);
                                                                            },
                                                                            onStart: function (evt: any) {
                                                                                startIndex = evt.oldIndex;
                                                                            },
                                                                        });
                                                                    } catch (e) {}
                                                                    clearInterval(interval);
                                                                }
                                                            }, 100);
                                                        },
                                                    };
                                                }) +
                                                html` <div
                                                    class=""
                                                    style="cursor:pointer;align-self: stretch; height: 50px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex"
                                                    onclick="${cf.gvc.event(() => {
                                                        MenusSetting.collectionEvent(
                                                            {
                                                                link: '',
                                                                title: '',
                                                                items: [],
                                                            },
                                                            (data) => {
                                                                array.push(data);
                                                                if (checkLinkExists(data, vm.link)) {
                                                                    gvc.notifyDataChange(vm.id);
                                                                    return true;
                                                                } else {
                                                                    array.splice(array.length - 1, 1);
                                                                    return false;
                                                                }
                                                            }
                                                        );
                                                    })}"
                                                >
                                                    <div
                                                        style="align-self: stretch; height: 54px; border-radius: 10px; border: 1px #DDDDDD solid; justify-content: center; align-items: center; gap: 6px; display: inline-flex"
                                                    >
                                                        <i class="fa-solid fa-plus" style="color: #3366BB;font-size: 16px; "></i>
                                                        <div style="color: #3366BB; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">新增選單</div>
                                                    </div>
                                                </div>`
                                            );
                                        }

                                        return renderItems(vm.link);
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="position-fixed bg-body bottom-0  w-100 d-flex align-items-center justify-content-end p-3 border-top" style="gap:10px;left:0px;">
                        ${BgWidget.cancel(
                            gvc.event(() => {
                                cf.goBack();
                            })
                        )}
                        ${BgWidget.save(
                            gvc.event(() => {
                                save();
                            }),
                            '確認'
                        )}
                    </div>`;
            },
            divCreate: {
                style: `padding-bottom:60px;`,
            },
        };
    });
}

// 模板選擇
function template_select(gvc: GVC, cf: any, vm: any, cVm: any, page_type: any) {
    return BgBlog.template_select(
        gvc,
        (c2) => {
            if (c2) {
                vm.data.content.config = c2;
                vm.data.content.name = c2.name;
                saveData(gvc, cf, vm, cVm, false).then(() => {
                    cVm.type = 'detail';
                });
            } else if (!vm.data.id) {
                vm.type = 'list';
                gvc.notifyDataChange(cVm.id);
            } else {
                cVm.type = 'detail';
                gvc.notifyDataChange(cVm.id);
            }
        },
        page_type
    );
}

(window as any).glitter.setModule(import.meta.url, BgBlog);
