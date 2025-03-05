import { HtmlJson, Plugin } from '../../glitterBundle/plugins/plugin-creater.js';
import { Glitter } from '../../glitterBundle/Glitter.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { getInitialData } from '../initial_data.js';
import { BaseApi } from '../../glitterBundle/api/base.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';

Plugin.createComponent(import.meta.url, (glitter: Glitter, editMode: boolean) => {
    return {
        render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData) => {
            const config = getInitialData({
                obj: widget.data,
                key: 'setting',
                def: {
                    container: {
                        style: {},
                    },
                    child: {
                        style: {},
                    },
                    loading: {
                        style: {},
                    },
                    list: [],
                    initial: {},
                    newData: {},
                    distance_with_data: 0,
                    loading_finish: {},
                    loadingView: {},
                },
            });
            const containerStyle = glitter.htmlGenerate.editor_component(config.container.style, gvc, widget as any, subData);
            const childStyle = glitter.htmlGenerate.editor_component(config.child.style, gvc, widget as any, subData);
            const loadingStyle = glitter.htmlGenerate.editor_component(config.loading.style, gvc, widget as any, subData);
            return {
                view: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        let vm: {
                            loading: boolean;
                            data: any[];
                        } = {
                            loading: false,
                            data: [],
                        };

                        function getPageView(tag: string, subData: any, cs: string, style: string) {
                            return new Promise(async (resolve, reject) => {
                                (window as any).glitterInitialHelper.getPageData(tag, (d2: any) => {
                                    let data = d2.response.result[0];
                                    data.config.map((dd: any) => {
                                        glitter.htmlGenerate.renameWidgetID(dd);
                                    });
                                    data.config.formData = data.page_config.formData;
                                    resolve(`<!-- tag=${tag} -->
            ${new glitter.htmlGenerate(data.config, [], subData).render(gvc, undefined, {
                childContainer: true,
                class: cs,
                style: style,
            })}
                                                `);
                                });
                            });
                        }

                        function initial() {
                            new Promise(async (resolve, reject) => {
                                vm.loading = true;
                                gvc.notifyDataChange(id);
                                vm.data = (await TriggerEvent.trigger({
                                    gvc: gvc, widget: widget, clickEvent: config.initial, subData: subData
                                })) as any
                                vm.loading = false
                                gvc.notifyDataChange(id)
                            })
                        }

                        initial();
                        return {
                            bind: id,
                            view: () => {
                                return new Promise(async (resolve, reject) => {
                                    const loadingView = await getPageView(config.loadingView.tag, subData, loadingStyle.class(), loadingStyle.style());
                                    if (vm.loading) {
                                        resolve(loadingView as string);
                                    } else {
                                        let viewList:any=[]
                                        for (const b of vm.data){
                                            console.log(`subData->`,b)
                                            const view=await getPageView(widget.data.tag,b,childStyle.class(),childStyle.style())
                                            viewList.push(view)
                                        }
                                        resolve(
                                            viewList
                                                .map((dd: any) => {
                                                    return dd;
                                                })
                                                .join(``)
                                        );
                                    }
                                });
                            },
                            divCreate: {
                                class: containerStyle.class(),
                                style: containerStyle.style(),
                            },
                            onCreate: () => {
                                return new Promise(async (resolve, reject) => {
                                    // 取得要監聽的元素
                                    let targetElement: any = gvc.getBindViewElem(id)!;
                                    if (targetElement.infinityScroll) {
                                        targetElement.removeEventListener('scroll', targetElement.infinityScroll);
                                    }
                                    targetElement.infinityScroll = function () {
                                        // 檢查是否已經滾動到底部
                                        if (targetElement.scrollTop + targetElement.clientHeight >= targetElement.scrollHeight - config.distance_with_data) {
                                            // 在這裡執行相應的操作或載入更多內容的程式碼
                                            if (!vm.loading) {
                                                vm.loading = true;
                                                new Promise(async () => {
                                                    const loading_finish = await TriggerEvent.trigger({
                                                        gvc: gvc,
                                                        widget: widget,
                                                        clickEvent: config.loading_finish,
                                                        subData: subData,
                                                    });
                                                    if (!loading_finish) {
                                                        const loadingID = gvc.glitter.getUUID();
                                                        const view = await getPageView(config.loadingView.tag, subData, loadingStyle.class() + ` ${loadingID}`, loadingStyle.style());
                                                        gvc.getBindViewElem(id)!.innerHTML += view;
                                                        const response = await TriggerEvent.trigger({
                                                            gvc: gvc,
                                                            widget: widget,
                                                            clickEvent: config.newData,
                                                            subData: subData,
                                                        });
                                                        for (const b of response as any) {
                                                            const view = await getPageView(widget.data.tag, b, childStyle.class(), childStyle.style());
                                                            gvc.getBindViewElem(id)!.innerHTML += view;
                                                        }
                                                        document.querySelector('.' + loadingID)!.remove();
                                                        vm.loading = false;
                                                    } else {
                                                        vm.loading = false;
                                                    }
                                                });
                                            }
                                        }
                                    };
                                    // 添加滾動事件監聽器
                                    targetElement.addEventListener('scroll', targetElement.infinityScroll);
                                    resolve(true);
                                });
                            },
                        };
                    });
                },
                editor: () => {
                    return [
                        containerStyle.editor(
                            gvc,
                            () => {
                                widget.refreshComponent();
                            },
                            '列表容器樣式'
                        ),
                        childStyle.editor(
                            gvc,
                            () => {
                                widget.refreshComponent();
                            },
                            '元件容器樣式'
                        ),
                        loadingStyle.editor(
                            gvc,
                            () => {
                                widget.refreshComponent();
                            },
                            '載入容器樣式'
                        ),
                        EditorElem.editerDialog({
                            gvc: gvc,
                            dialog: (gvc: GVC) => {
                                return [
                                    TriggerEvent.editer(gvc, widget, config.initial, {
                                        hover: false,
                                        option: [],
                                        title: '首次載入資料來源',
                                    }),
                                    TriggerEvent.editer(gvc, widget, config.newData, {
                                        hover: false,
                                        option: [],
                                        title: '滾動至底部，載入新資料',
                                    }),
                                    EditorElem.editeInput({
                                        gvc: gvc,
                                        title: '距離底部位置',
                                        default: `${config.distance_with_data}`,
                                        placeHolder: '複製數量',
                                        callback: (text) => {
                                            config.distance_with_data = parseInt(text, 10);
                                        },
                                        type: 'number',
                                    }),
                                    TriggerEvent.editer(gvc, widget, config.loading_finish, {
                                        hover: false,
                                        option: [],
                                        title: '判斷是否載入完畢',
                                    }),
                                ].join('<div class="my-2"></div>');
                            },
                            width: '400px',
                            editTitle: `資料來源設定`,
                        }),
                        (() => {
                            const id = glitter.getUUID();
                            const data: any = {
                                dataList: undefined,
                            };
                            const saasConfig = (window as any).saasConfig;

                            function getData() {
                                BaseApi.create({
                                    url: saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                                    type: 'GET',
                                    timeout: 0,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }).then((d2) => {
                                    data.dataList = d2.response.result.filter((dd: any) => {
                                        return dd.group !== 'glitter-article';
                                    });
                                    gvc.notifyDataChange(id);
                                });
                            }

                            function setPage(pd: any) {
                                let group: string[] = [];
                                let selectGroup = '';
                                pd.carryData = pd.carryData ?? {};
                                let id = glitter.getUUID();
                                data.dataList.map((dd: any) => {
                                    if (dd.tag === pd.tag) {
                                        selectGroup = dd.group;
                                    }
                                    if (group.indexOf(dd.group) === -1) {
                                        group.push(dd.group);
                                    }
                                });
                                return gvc.bindView(() => {
                                    return {
                                        bind: id,
                                        view: () => {
                                            return [
                                                EditorElem.select({
                                                    title: '選擇嵌入頁面',
                                                    gvc: gvc,
                                                    def: pd.tag ?? '',
                                                    array: [
                                                        {
                                                            title: '選擇嵌入頁面',
                                                            value: '',
                                                        },
                                                    ].concat(
                                                        data.dataList
                                                            .sort(function (a: any, b: any) {
                                                                if (a.group.toUpperCase() < b.group.toUpperCase()) {
                                                                    return -1;
                                                                }
                                                                if (a.group.toUpperCase() > b.group.toUpperCase()) {
                                                                    return 1;
                                                                }
                                                                return 0;
                                                            })
                                                            .map((dd: any) => {
                                                                return {
                                                                    title: `${dd.group}-${dd.name}`,
                                                                    value: dd.tag,
                                                                };
                                                            })
                                                    ),
                                                    callback: (text: string) => {
                                                        pd.tag = text;
                                                    },
                                                }),
                                                (() => {
                                                    return TriggerEvent.editer(gvc, widget, pd.carryData, {
                                                        hover: true,
                                                        option: [],
                                                        title: '夾帶資料<[ subData.carryData ]>',
                                                    });
                                                })(),
                                            ].join(`<div class="my-2"></div>`);
                                        },
                                        divCreate: {
                                            class: `mb-2`,
                                        },
                                    };
                                });
                            }

                            const html = String.raw;
                            return gvc.bindView(() => {
                                return {
                                    bind: id,
                                    view: () => {
                                        if (data.dataList) {
                                            return [
                                                EditorElem.editerDialog({
                                                    gvc: gvc,
                                                    dialog: (gvc: GVC) => {
                                                        return (
                                                            setPage(widget.data) +
                                                            `<div class="d-flex w-100 p-2 border-top ">
                                                             <div class="flex-fill"></div>
                                                             <div class="btn btn-primary-c ms-2"
                                                                  style="height:40px;width:80px;"
                                                                  onclick="${gvc.event(() => {
                                                                      gvc.closeDialog();
                                                                      widget.refreshComponent();
                                                                  })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存
                                                             </div>
                                                         </div>`
                                                        );
                                                    },
                                                    editTitle: `預設嵌入頁面`,
                                                }),
                                                EditorElem.editerDialog({
                                                    gvc: gvc,
                                                    dialog: (gvc: GVC) => {
                                                        return (
                                                            setPage(config.loadingView) +
                                                            `<div class="d-flex w-100 p-2 border-top ">
                                                             <div class="flex-fill"></div>
                                                             <div class="btn btn-primary-c ms-2"
                                                                  style="height:40px;width:80px;"
                                                                  onclick="${gvc.event(() => {
                                                                      gvc.closeDialog();
                                                                      widget.refreshComponent();
                                                                  })}"><i class="fa-solid fa-floppy-disk me-2"></i>儲存
                                                             </div>
                                                         </div>`
                                                        );
                                                    },
                                                    editTitle: `載入動畫嵌入`,
                                                }),
                                                html` <div class="mx-n2">
                                                    ${gvc.bindView(() => {
                                                        const id = glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return new Promise((resolve, reject) => {
                                                                    BaseApi.create({
                                                                        url: saasConfig.config.url + `/api/v1/template?appName=${saasConfig.config.appName}`,
                                                                        type: 'GET',
                                                                        timeout: 0,
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    }).then((d2) => {
                                                                        data.dataList = d2.response.result;
                                                                        let map = [
                                                                            `<div class="mx-0 d-flex   px-2 hi fw-bold d-flex align-items-center border-bottom border-top py-2 bgf6" style="color:#151515;font-size:16px;gap:0px;">
                                               嵌入頁面編輯
                                            </div>`,
                                                                        ];
                                                                        const def = data.dataList.find((dd: any) => {
                                                                            return dd.tag === widget.data.tag;
                                                                        });
                                                                        def &&
                                                                            map.push(`<div class="btn " style="background:white;width:calc(100% - 20px);border-radius:8px;
                    min-height:45px;border:1px solid black;color:#151515;margin-left:10px;" onclick="${gvc.event(() => {
                        glitter.setUrlParameter('page', def.tag);
                        glitter.share.reloadEditor();
                    })}">${def.name}</div>`);
                                                                        config.list.map((d2: any) => {
                                                                            const def = data.dataList.find((dd: any) => {
                                                                                return dd.tag === d2.tag;
                                                                            });
                                                                            def &&
                                                                                map.push(`<div class="btn " style="background:white;width:calc(100% - 20px);border-radius:8px;
                    min-height:45px;border:1px solid black;color:#151515;margin-left:10px;" onclick="${gvc.event(() => {
                        glitter.setUrlParameter('page', def.tag);
                        location.reload();
                    })}">${def.name}</div>`);
                                                                        });
                                                                        if (map.length === 1) {
                                                                            resolve('');
                                                                        } else {
                                                                            resolve(map.join(`<div class="my-2"></div>`));
                                                                        }
                                                                    });
                                                                });
                                                            },
                                                            divCreate: {},
                                                        };
                                                    })}
                                                </div>`,
                                            ].join(` <div class="my-2"></div>`);
                                        } else {
                                            return ``;
                                        }
                                    },
                                    divCreate: {},
                                    onCreate: () => {
                                        if (!data.dataList) {
                                            setTimeout(() => {
                                                getData();
                                            }, 100);
                                        }
                                    },
                                };
                            });
                        })(),
                    ].join(`<div class="my-2"></div>`);
                },
            };
        },
    };
});
