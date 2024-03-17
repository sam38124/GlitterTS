var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { GlobalData } from "../event.js";
const html = String.raw;
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            return {
                editor: () => {
                    return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();
                        function recursive() {
                            if (GlobalData.data.pageList.length === 0) {
                                GlobalData.data.run();
                                setTimeout(() => {
                                    recursive();
                                }, 200);
                            }
                            else {
                                gvc.notifyDataChange(id);
                            }
                        }
                        recursive();
                        setTimeout(() => {
                            gvc.notifyDataChange(id);
                        }, 1000);
                        return {
                            bind: id,
                            view: () => {
                                if (![
                                    { title: '內部連結', value: 'inlink' },
                                    { title: '外部連結', value: 'outlink' },
                                    { title: 'HashTag', value: 'hashTag' },
                                ].find((dd) => {
                                    return dd.value === object.link_change_type;
                                })) {
                                    object.link_change_type = 'inlink';
                                }
                                return ` ${EditorElem.h3('跳轉方式')}
                                    <select
                                        class="form-control form-select"
                                        onchange="${gvc.event((e) => {
                                    object.link_change_type = e.value;
                                    gvc.notifyDataChange(id);
                                })}"
                                    >
                                        ${[
                                    { title: '內部連結', value: 'inlink' },
                                    { title: '外部連結', value: 'outlink' },
                                    { title: 'HashTag', value: 'hashTag' },
                                ]
                                    .map((dd) => {
                                    return `<option value="${dd.value}" ${dd.value == object.link_change_type ? `selected` : ``}>
                                            ${dd.title}
                                        </option>`;
                                })
                                    .join('')}
                                    </select>
                                    ${(() => {
                                    var _a, _b, _c, _d, _e;
                                    if (object.link_change_type === 'inlink') {
                                        object.stackControl = (_a = object.stackControl) !== null && _a !== void 0 ? _a : "home";
                                        object.switchType = (_b = object.switchType) !== null && _b !== void 0 ? _b : 'template';
                                        object.linkFrom = (_c = object.linkFrom) !== null && _c !== void 0 ? _c : 'manual';
                                        object.linkFromEvent = (_d = object.linkFromEvent) !== null && _d !== void 0 ? _d : {};
                                        return html `
                                            ${EditorElem.select({
                                            title: '堆棧控制',
                                            gvc: gvc,
                                            def: object.stackControl,
                                            callback: (text) => {
                                                object.stackControl = text;
                                                widget.refreshComponent();
                                            },
                                            array: [{ title: '設為首頁', value: "home" }, {
                                                    title: '頁面跳轉',
                                                    value: "page"
                                                }],
                                        })}
                                            ${[
                                            EditorElem.select({
                                                title: '連結來源',
                                                gvc: gvc,
                                                def: object.linkFrom,
                                                array: [
                                                    { title: '手動設定', value: 'manual' },
                                                    { title: '觸發事件', value: 'code' }
                                                ],
                                                callback: (text) => {
                                                    object.linkFrom = text;
                                                    gvc.notifyDataChange(id);
                                                }
                                            }),
                                            (object.linkFrom === 'manual') ? [
                                                EditorElem.select({
                                                    title: '跳轉類型',
                                                    gvc: gvc,
                                                    def: object.switchType,
                                                    array: [
                                                        { title: '設計頁面', value: 'template' },
                                                        { title: 'Blog / 網誌', value: 'article' }
                                                    ],
                                                    callback: (text) => {
                                                        object.switchType = text;
                                                        gvc.notifyDataChange(id);
                                                    }
                                                }),
                                                `<select
                                                    class="form-select form-control mt-2"
                                                    onchange="${gvc.event((e) => {
                                                    object.link = window.$(e).val();
                                                })}"
                                            >
                                                ${GlobalData.data.pageList.filter((dd) => {
                                                    if (object.switchType === 'template') {
                                                        return dd.group !== 'glitter-article';
                                                    }
                                                    else {
                                                        return dd.group === 'glitter-article';
                                                    }
                                                }).map((dd) => {
                                                    object.link = object.link || dd.tag;
                                                    return `<option value="${dd.tag}" ${object.link === dd.tag ? `selected` : ``}>
                                                    ${(`${dd.group}-${dd.name}`).replace('glitter-article', '')}
                                                </option>`;
                                                })}
                                            </select>`
                                            ].join('<div class="my-2"></div>') : [
                                                TriggerEvent.editer(gvc, widget, object.linkFromEvent, {
                                                    title: '獲取連結來源'
                                                })
                                            ].join('')
                                        ].join(`<div class="my-2"></div>`)}
                                        `;
                                    }
                                    else if (object.link_change_type === 'outlink') {
                                        return gvc.glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: object.link,
                                            placeHolder: '輸入跳轉的連結',
                                            callback: (text) => {
                                                object.link = text;
                                                widget.refreshAll();
                                            },
                                        }) + EditorElem.select({
                                            gvc: gvc,
                                            title: '跳轉方式',
                                            def: (_e = object.changeType) !== null && _e !== void 0 ? _e : "location",
                                            array: [
                                                { title: "本地跳轉", value: "location" },
                                                { title: "打開新頁面", value: "newTab" }
                                            ],
                                            callback: (text) => {
                                                object.changeType = text;
                                                widget.refreshAll();
                                            },
                                        });
                                    }
                                    else {
                                        return gvc.glitter.htmlGenerate.editeInput({
                                            gvc: gvc,
                                            title: '',
                                            default: object.link,
                                            placeHolder: '輸入跳轉的HashTag',
                                            callback: (text) => {
                                                object.link = text;
                                                widget.refreshAll();
                                            },
                                        });
                                    }
                                })()}`;
                            },
                            divCreate: {},
                        };
                    });
                },
                event: () => {
                    var _a;
                    try {
                        window.resetClock();
                    }
                    catch (e) {
                    }
                    console.log(`changePage-Plugin-Time:`, window.renderClock.stop());
                    object.link_change_type = (_a = object.link_change_type) !== null && _a !== void 0 ? _a : object.type;
                    if (object.link_change_type === 'inlink') {
                        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                            const link = (object.linkFrom === 'code') ? (yield TriggerEvent.trigger({
                                gvc: gvc, widget: widget, clickEvent: object.linkFromEvent, subData: subData
                            })) : (object.link);
                            if (link) {
                                const url = new URL('./', location.href);
                                url.searchParams.set('page', link);
                                const saasConfig = window.saasConfig;
                                window.glitterInitialHelper.getPageData(link, (data) => {
                                    if (data.response.result.length === 0) {
                                        const url = new URL("./", location.href);
                                        url.searchParams.set('page', data.response.redirect);
                                        location.href = url.href;
                                        return;
                                    }
                                    if (object.stackControl === 'home') {
                                        const cf = {
                                            app_config: saasConfig.appConfig,
                                            page_config: data.response.result[0].page_config,
                                            config: data.response.result[0].config,
                                            data: subData !== null && subData !== void 0 ? subData : {},
                                            tag: link
                                        };
                                        if (gvc.glitter.getUrlParameter('isIframe') === 'true') {
                                            window.parent.glitter.htmlGenerate.setHome(cf);
                                        }
                                        else {
                                            gvc.glitter.htmlGenerate.setHome(cf);
                                        }
                                        resolve(true);
                                    }
                                    else {
                                        const cf = {
                                            app_config: saasConfig.appConfig,
                                            page_config: data.response.result[0].page_config,
                                            config: data.response.result[0].config,
                                            data: subData !== null && subData !== void 0 ? subData : {},
                                            tag: link,
                                            goBack: true
                                        };
                                        if (gvc.glitter.getUrlParameter('isIframe') === 'true') {
                                            window.parent.glitter.htmlGenerate.changePage(cf);
                                        }
                                        else {
                                            gvc.glitter.htmlGenerate.changePage(cf);
                                        }
                                        resolve(true);
                                    }
                                });
                            }
                        }));
                    }
                    else if (object.link_change_type === 'hashTag') {
                        const yOffset = $("header").length > 0 ? -$("header").height() : 0;
                        const element = document.getElementsByClassName(`glitterTag${object.link}`)[0];
                        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: "smooth" });
                        return true;
                    }
                    else {
                        if (object.changeType === 'newTab') {
                            gvc.glitter.openNewTab(object.link);
                        }
                        else {
                            gvc.glitter.location.href = object.link;
                        }
                        return true;
                    }
                },
            };
        },
    };
});
