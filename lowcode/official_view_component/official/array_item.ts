import { HtmlJson, Plugin } from '../../glitterBundle/plugins/plugin-creater.js';
import { Glitter } from '../../glitterBundle/Glitter.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';
import { component } from './component.js';
import { BaseApi } from '../../glitterBundle/api/base.js';
import { PageSplit } from '../../backend-manager/splitPage.js';

export const array_item = Plugin.createComponent(import.meta.url, (glitter: Glitter, editMode: boolean) => {
    return {
        render: (gvc: GVC, widget: HtmlJson, setting: HtmlJson[], hoverID: string[], subData) => {
            widget.data.empty = widget.data.empty ?? {
                data: {},
            };
            widget.data.empty.refreshComponent = () => {};
            widget.data.loading = widget.data.loading ?? {
                data: {},
            };
            widget.data.container = widget.data.container ?? {};
            return {
                view: () => {
                    const pageSpilt = new PageSplit(gvc);
                    const id = glitter.getUUID();
                    let loading = ``;
                    let views: any = undefined;
                    const vm: {
                        loading: boolean;
                        data: any;
                    } = {
                        loading: true,
                        data: undefined,
                    };
                    function getData() {
                        views = '';
                        vm.loading=true
                        gvc.notifyDataChange(id);
                        new Promise(async (resolve, reject) => {
                            let view: any = [];
                            let createOption = () => {
                                return {
                                    class: glitter.htmlGenerate.styleEditor(widget.data).class(),
                                    style: glitter.htmlGenerate.styleEditor(widget.data).style(),
                                };
                            };
                            const data: any = await TriggerEvent.trigger({
                                gvc,
                                widget,
                                clickEvent: widget.data,
                                subData: subData,
                            });
                            vm.data = data;
                            async function getView() {
                                let cfMap: any = {};
                                for (const a of data) {
                                    await new Promise(async (resolve, reject) => {
                                        const saasConfig = (window as any).saasConfig;
                                        let fal = 0;
                                        let tag = widget.data.tag;
                                        let carryData = widget.data.carryData;
                                        let subData: any = a;
                                        for (const b of widget.data.list) {
                                            b.evenet = b.evenet ?? {};
                                            try {
                                                if (b.triggerType === 'trigger') {
                                                    const result = await new Promise((resolve, reject) => {
                                                        TriggerEvent.trigger({
                                                            gvc: gvc,
                                                            widget: widget,
                                                            clickEvent: b.evenet,
                                                            subData,
                                                        }).then((data) => {
                                                            resolve(data);
                                                        });
                                                    });
                                                    if (result) {
                                                        tag = b.tag;
                                                        carryData = b.carryData;
                                                        break;
                                                    }
                                                } else {
                                                    if ((await eval(b.code)) === true) {
                                                        tag = b.tag;
                                                        carryData = b.carryData;
                                                        break;
                                                    }
                                                }
                                            } catch (e) {}
                                        }
                                        try {
                                            subData.carryData = await TriggerEvent.trigger({
                                                gvc: gvc,
                                                clickEvent: carryData,
                                                widget: widget,
                                                subData: subData,
                                            });
                                        } catch (e) {}
                                        if (!cfMap[tag]) {
                                            cfMap[tag] = await new Promise((resolve, reject) => {
                                                (window as any).glitterInitialHelper.getPageData(tag, (d2: any) => {
                                                    resolve(d2.response.result[0]);
                                                });
                                            });
                                        }
                                        const config = JSON.parse(JSON.stringify(cfMap[tag].config));
                                        config.map((dd: any) => {
                                            glitter.htmlGenerate.renameWidgetID(dd);
                                        });
                                        view.push(new glitter.htmlGenerate(config, [], subData).render(gvc, undefined, createOption));
                                        resolve(true);
                                    });
                                }
                                const data2 = view.join('');
                                resolve(data2);
                            }
                            getView().then((r) => {});
                        }).then((data: any) => {
                            vm.loading = false;
                            views = data;
                            glitter.share.notify = glitter.share.notify ?? {};
                            gvc.notifyDataChange(id);
                        });
                    }
                    getData();
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                if (vm.loading) {
                                    return `<div class="w-100 d-flex align-items-center justify-content-center p-3"><div class="spinner-border "></div></div>`
                                    // return component.render(gvc, widget.data.loading, setting, hoverID, subData).view() || `<span>loading...</span>`;
                                } else if (views) {
                                    return (
                                        views +
                                        (vm.data.pageSize
                                            ? pageSpilt.pageSplit(vm.data.pageSize, vm.data.pageIndex + 1, (p) => {
                                                  subData.pageIndex = p - 1;
                                                  getData();
                                              })
                                            : ``)
                                    );
                                } else {
                                    return component.render(gvc, widget.data.empty, setting, hoverID, subData).view();
                                }

                                // try {
                                //     return loading
                                // } catch (e) {
                                //     return ``
                                // }
                            },
                            onCreate: () => {},
                            divCreate: {
                                class: glitter.htmlGenerate.styleEditor(widget.data.container).class(),
                                style: glitter.htmlGenerate.styleEditor(widget.data.container).style(),
                                option: [{ key: 'arrayItem', value: 'true' }],
                            },
                        };
                    });
                },
                editor: () => {
                    // Editor.searchInput()
                    return gvc.map([
                        glitter.htmlGenerate.styleEditor(widget.data.container).editor(
                            gvc,
                            () => {
                                widget.refreshComponent();
                            },
                            '容器樣式'
                        ),
                        `<div class="my-2"></div>`,
                        glitter.htmlGenerate.styleEditor(widget.data).editor(
                            gvc,
                            () => {
                                widget.refreshComponent();
                            },
                            '元件樣式'
                        ),
                        `<div class="alert alert-info mt-2" style="white-space:normal;">
透過返回陣列來進行遍歷，並產生元件畫面．
${TriggerEvent.editer(gvc, widget, widget.data, {
    hover: false,
    option: [],
    title: '設定資料來源',
})}
</div>`,
                        `<div class="border-white border p-2  mt-3" style="background:#a2d4ed;">
${EditorElem.h3('嵌入模塊')}
${component.render(gvc, widget, setting, hoverID, subData).editor() as string}
</div>`,
                        `<div class="border-white border p-2  mt-3" style="background:#a2d4ed;">
${EditorElem.h3('空資料顯示')}
${component.render(gvc, widget.data.empty, setting, hoverID, subData).editor() as string}
</div>`,
                        `<div class="border-white border p-2  mt-3" style="background:#a2d4ed;">
${EditorElem.h3('載入中顯示')}
${component.render(gvc, widget.data.loading, setting, hoverID, subData).editor() as string}
</div>`,
                    ]);
                },
            };
        },
    };
});
