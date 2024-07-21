var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { getInitialData } from "../initial_data.js";
import autosize from "../../glitterBundle/plugins/autosize.js";
import { ApiPageConfig } from "../../api/pageConfig.js";
import { NormalPageEditor } from "../../editor/normal-page-editor.js";
export class FormWidget {
    static settingView(obj) {
        var _a;
        const gvc = obj.gvc;
        const array = obj.array;
        const glitter = obj.gvc.glitter;
        return EditorElem.arrayItem({
            title: (_a = obj.title) !== null && _a !== void 0 ? _a : "表單項目",
            gvc: gvc,
            array: () => {
                return array.map((dd, index) => {
                    var _a;
                    return {
                        title: (_a = dd.title) !== null && _a !== void 0 ? _a : `選項.${index + 1}`,
                        innerHtml: () => {
                            const editor_refer = window.parent.glitter.share.NormalPageEditor || NormalPageEditor;
                            const gvc = window.parent.glitter.pageConfig[window.parent.glitter.pageConfig.length - 1].gvc;
                            editor_refer.closeEvent = () => {
                                obj.widget && obj.widget.refreshComponent();
                                obj.refresh();
                            };
                            editor_refer.toggle({
                                visible: true,
                                title: obj.title || '表單項目',
                                view: (() => {
                                    dd.type = dd.type || 'form_plugin_v2';
                                    dd.require = dd.require || 'false';
                                    return gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return `${[
                                                    `<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 mt-n2 p-2 border-bottom shadow">
                <span class="fs-6 fw-bold " style="color:black;">表單插件設定</span>
            </div>`,
                                                    EditorElem.editeInput({
                                                        gvc: gvc,
                                                        title: 'Label名稱',
                                                        placeHolder: `請輸入Label名稱`,
                                                        default: dd.title,
                                                        callback: (text) => {
                                                            dd.title = text;
                                                            if (obj.user_mode) {
                                                                dd.key = text;
                                                            }
                                                            obj.refresh();
                                                        }
                                                    }),
                                                    EditorElem.select({
                                                        title: "是否必填",
                                                        gvc: gvc,
                                                        def: dd.require,
                                                        array: [
                                                            {
                                                                title: '是',
                                                                value: 'true'
                                                            },
                                                            {
                                                                title: '否',
                                                                value: 'false'
                                                            }
                                                        ],
                                                        callback: (text) => {
                                                            dd.require = text;
                                                            gvc.notifyDataChange(id);
                                                        }
                                                    }),
                                                    ...(() => {
                                                        var _a, _b, _c;
                                                        dd.formFormat = (_a = dd.formFormat) !== null && _a !== void 0 ? _a : '{}';
                                                        dd.col = (_b = dd.col) !== null && _b !== void 0 ? _b : "12";
                                                        dd.col_sm = (_c = dd.col_sm) !== null && _c !== void 0 ? _c : "12";
                                                        const html = String.raw;
                                                        let config_array = [EditorElem.buttonPrimary(dd.moduleName || '選擇表單插件', gvc.event(() => {
                                                                editor_refer.toggle({
                                                                    visible: true,
                                                                    view: gvc.bindView(() => {
                                                                        return {
                                                                            bind: gvc.glitter.getUUID(),
                                                                            view: () => {
                                                                                return new Promise((resolve, reject) => {
                                                                                    window.parent.glitter.getModule(new URL(window.parent.glitter.root_path + 'editor/add-component.js').href, (AddComponent) => {
                                                                                        resolve(AddComponent.addModuleView(gvc, 'form_plugin', (tData) => {
                                                                                            dd.appName = tData.copyApp;
                                                                                            dd.page = tData.copy;
                                                                                            dd.moduleName = tData.title;
                                                                                            editor_refer.back();
                                                                                            gvc.notifyDataChange(id);
                                                                                        }, false, true, obj.user_mode));
                                                                                    });
                                                                                });
                                                                            }
                                                                        };
                                                                    }),
                                                                    title: '選擇插件'
                                                                });
                                                            })),
                                                            `<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 border-top p-2 border-bottom shadow">
                                                                    <span class="fs-6 fw-bold " style="color:black;">表單設計</span>
                                                                </div>`, html `
                                                                <div class="alert alert-info fs-6 fw-500"
                                                                     style="white-space: normal;">
                                                                    一列有12格，可自定義手機版與電腦版每列的顯示格數
                                                                </div>
                                                                <div class="d-flex align-items-center"
                                                                     style="gap:10px;">
                                                                    <div class="fs-6 fw-500">電腦版</div>
                                                                    <input class="form-control flex-fill" type="number"
                                                                           placeholder="" value="${dd.col}" onchange="${obj.gvc.event((e, event) => {
                                                                dd.col = e.value;
                                                            })}">
                                                                    <div class="fs-6 fw-500">手機版</div>
                                                                    <input class="form-control flex-fill" type="number" 
                                                                           value="${dd.col_sm}"
                                                                           onchange="${obj.gvc.event((e, event) => {
                                                                dd.col_sm = e.value;
                                                            })}"
                                                                           placeholder="">
                                                                </div>
                                                            `];
                                                        if (!obj.user_mode) {
                                                            config_array = config_array.concat([
                                                                `<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 border-top p-2 border-bottom shadow">
                <span class="fs-6 fw-bold " style="color:black;">進階設定</span>
            </div>`,
                                                                EditorElem.editeInput({
                                                                    gvc: gvc,
                                                                    title: 'Key標籤',
                                                                    placeHolder: `請輸入Key標籤`,
                                                                    default: dd.key,
                                                                    callback: (text) => {
                                                                        dd.key = text;
                                                                        obj.refresh();
                                                                    }
                                                                }),
                                                                EditorElem.buttonPrimary('隱藏條件', gvc.event(() => {
                                                                    editor_refer.toggle({
                                                                        visible: true,
                                                                        view: `<div class="p-2">${gvc.bindView(() => {
                                                                            return {
                                                                                bind: gvc.glitter.getUUID(),
                                                                                view: () => {
                                                                                    return new Promise((resolve, reject) => {
                                                                                        resolve(EditorElem.codeEditor({
                                                                                            gvc: gvc,
                                                                                            height: 500,
                                                                                            initial: dd.hidden_code || '',
                                                                                            title: "代碼區塊",
                                                                                            callback: (text) => {
                                                                                                dd.hidden_code = text;
                                                                                            },
                                                                                            structStart: `((form_data,form_key)=>{`
                                                                                        }));
                                                                                    });
                                                                                }
                                                                            };
                                                                        })}</div>`,
                                                                        title: '選擇插件'
                                                                    });
                                                                }))
                                                            ]);
                                                        }
                                                        else {
                                                            dd.key = dd.title;
                                                        }
                                                        config_array.push(gvc.bindView(() => {
                                                            return {
                                                                bind: gvc.glitter.getUUID(),
                                                                view: () => {
                                                                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                                                        if (!dd.page) {
                                                                            resolve('');
                                                                        }
                                                                        let formFormat = (yield ApiPageConfig.getPage({
                                                                            appName: dd.appName,
                                                                            tag: dd.page
                                                                        })).response.result[0].page_config.formFormat;
                                                                        if (formFormat && formFormat.length > 0) {
                                                                            dd.form_config = dd.form_config || {};
                                                                            resolve(`<div class="position-relative bgf6 d-flex align-items-center justify-content-between mx-n2 border-top p-2 border-bottom shadow">
                <span class="fs-6 fw-bold " style="color:black;">插件內容編輯</span>
            </div>` + `<div class="mx-n2">${FormWidget.editorView({
                                                                                gvc: gvc,
                                                                                array: formFormat,
                                                                                refresh: (key) => {
                                                                                },
                                                                                formData: dd.form_config
                                                                            })}</div>`);
                                                                        }
                                                                        else {
                                                                            if (obj.user_mode) {
                                                                                resolve('');
                                                                            }
                                                                            else {
                                                                                resolve(EditorElem.customCodeEditor({
                                                                                    gvc: gvc,
                                                                                    height: 400,
                                                                                    initial: dd.formFormat,
                                                                                    title: 'Config配置檔',
                                                                                    callback: (data) => {
                                                                                        dd.form_config = undefined;
                                                                                        dd.formFormat = data;
                                                                                    },
                                                                                    language: 'json'
                                                                                }));
                                                                            }
                                                                        }
                                                                    }));
                                                                }
                                                            };
                                                        }));
                                                        return config_array;
                                                    })(),
                                                ].join('<div class="my-2"></div>')}`;
                                            },
                                            divCreate: {
                                                class: `p-2`
                                            }
                                        };
                                    });
                                })(),
                                width: 400
                            });
                        },
                        expand: dd,
                        minus: gvc.event(() => {
                            array.splice(index, 1);
                            obj.refresh();
                        })
                    };
                });
            },
            copyable: true,
            originalArray: array,
            expand: {},
            plus: {
                title: "新增選項",
                event: gvc.event((e, event) => {
                    array.push({
                        "key": 'r_' + new Date().getTime(),
                        "page": "input",
                        "type": "form_plugin_v2",
                        "group": "",
                        "title": "標題",
                        "appName": "cms_system",
                        "require": "true",
                        "readonly": "write",
                        "formFormat": "{}",
                        "moduleName": "輸入框",
                        "style_data": {
                            "input": {
                                "list": [],
                                "class": "",
                                "style": "",
                                "version": "v2"
                            },
                            "label": {
                                "list": [],
                                "class": "form-label fs-base ",
                                "style": "",
                                "version": "v2"
                            },
                            "container": {
                                "list": [],
                                "class": "",
                                "style": "",
                                "version": "v2"
                            }
                        },
                        "form_config": {
                            "type": "name",
                            "title": "",
                            "place_holder": ""
                        }
                    });
                    obj.refresh();
                })
            },
            refreshComponent: () => {
                obj.refresh();
            },
            customEditor: true
        });
    }
    static editorView(obj) {
        const html = String.raw;
        const glitter = obj.gvc.glitter;
        const gvc = obj.gvc;
        const formData = obj.formData;
        function getRaw(array) {
            return array.map((dd) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const labelCSS = glitter.htmlGenerate.editor_component(dd.style_data.label, gvc, obj.widget, obj.subData);
                const inputCSS = glitter.htmlGenerate.editor_component(dd.style_data.input, gvc, obj.widget, obj.subData);
                const containerCss = glitter.htmlGenerate.editor_component(dd.style_data.container, gvc, obj.widget, obj.subData);
                const label = `<label class="${labelCSS.class()}" style="${labelCSS.style()}"><span class="text-danger  ${dd.require === "true" ? `` : 'd-none'}"> * </span>${dd.title}</label>`;
                const containerClass = `${dd.col ? `col-sm-${dd.col}` : 'col-sm-12'} ${dd.col_sm ? `col-${dd.col_sm}` : 'col-12'}  ${(_a = containerCss.class()) !== null && _a !== void 0 ? _a : ``}`;
                const containerStyle = (_b = containerCss.style()) !== null && _b !== void 0 ? _b : ``;
                const inputClass = inputCSS.class() || "form-control";
                const inputStyle = inputCSS.style() || "";
                if (!formData[dd.key]) {
                    formData[dd.key] = dd.def;
                }
                if (dd.readonly === 'block') {
                    return ``;
                }
                const readonly = ((dd.readonly === 'read') || obj.readonly === 'read');
                switch (dd.type) {
                    case "textArea":
                        const textID = gvc.glitter.getUUID();
                        return html `
                            <div class="${containerClass}" style="${containerStyle}">
                                ${label}
                                ${obj.gvc.bindView({
                            bind: textID,
                            view: () => {
                                var _a;
                                return (_a = formData[dd.key]) !== null && _a !== void 0 ? _a : "";
                            },
                            divCreate: {
                                elem: `textArea`,
                                style: inputStyle,
                                class: inputClass, option: [
                                    {
                                        key: 'onchange', value: obj.gvc.event((e) => {
                                            formData[dd.key] = e.value;
                                            obj.refresh(dd.key);
                                        })
                                    },
                                    ...(() => {
                                        if (readonly) {
                                            return [
                                                { key: 'readonly', value: '' }
                                            ];
                                        }
                                        else {
                                            return [];
                                        }
                                    })()
                                ]
                            },
                            onCreate: () => {
                                autosize(obj.gvc.getBindViewElem(textID));
                            }
                        })}
                            </div>`;
                    case "array":
                        formData[dd.key] = Array.isArray(formData[dd.key]) ? formData[dd.key] : [];
                        return gvc.bindView(() => {
                            const arrayViewID = gvc.glitter.getUUID();
                            return {
                                bind: arrayViewID,
                                view: () => {
                                    return html `
                                        <div class="${containerClass} mt-2" style="${containerStyle}">
                                            ${label}
                                            ${EditorElem.arrayItem({
                                        gvc: gvc,
                                        title: '',
                                        array: () => {
                                            return formData[dd.key].map((d2, index) => {
                                                return {
                                                    title: d2[dd.referTitile] || `選項:${index + 1}`,
                                                    innerHtml: (gvc) => {
                                                        return `<div class="my-2">${FormWidget.editorView({
                                                            gvc: gvc,
                                                            array: dd.formList,
                                                            refresh: (key) => {
                                                                obj.refresh(dd.key);
                                                            },
                                                            widget: obj.widget,
                                                            subData: obj.subData,
                                                            formData: d2,
                                                            readonly: obj.readonly
                                                        })}</div>`;
                                                    }
                                                };
                                            });
                                        },
                                        originalArray: formData[dd.key],
                                        expand: {},
                                        refreshComponent: () => {
                                            obj.refresh(dd.key);
                                            gvc.notifyDataChange(arrayViewID);
                                        },
                                        plus: {
                                            title: dd.plusBtn,
                                            event: gvc.event(() => {
                                                formData[dd.key].push({});
                                                gvc.notifyDataChange(arrayViewID);
                                                obj.refresh(dd.key);
                                            })
                                        }
                                    })}
                                        </div>`;
                                }
                            };
                        });
                    case 'file':
                        return EditorElem.uploadFile({
                            title: label,
                            gvc: gvc,
                            def: formData[dd.key],
                            callback: (text) => {
                                formData[dd.key] = text;
                                obj.refresh(dd.key);
                            },
                            readonly: readonly !== null && readonly !== void 0 ? readonly : false,
                        });
                    case 'select':
                        formData[dd.key] = (_c = formData[dd.key]) !== null && _c !== void 0 ? _c : ((_d = dd.formList[0]) !== null && _d !== void 0 ? _d : {}).key;
                        return EditorElem.select({
                            title: label,
                            gvc: gvc,
                            class: inputClass !== null && inputClass !== void 0 ? inputClass : '',
                            style: inputStyle !== null && inputStyle !== void 0 ? inputStyle : '',
                            def: formData[dd.key],
                            array: dd.formList.map((dd) => {
                                return {
                                    title: dd.title,
                                    value: dd.key
                                };
                            }),
                            readonly: readonly !== null && readonly !== void 0 ? readonly : false,
                            callback: (text) => {
                                if (!readonly) {
                                    formData[dd.key] = text;
                                    obj.refresh(dd.key);
                                }
                            }
                        });
                    case 'page_select':
                        return EditorElem.pageSelect(gvc, '選擇頁面', formData[dd.key], (data) => {
                            formData[dd.key] = data;
                        }, (dd) => {
                            return dd.group !== 'glitter-article';
                        });
                    case 'fontawesome':
                        return `<div class="${containerClass}" style="${containerStyle}">
                    ${label}
                    <div class="alert alert-info p-2 mb-2" style="word-break: break-word;white-space: normal;">前往<a onclick="${gvc.event(() => {
                            glitter.openNewTab('https://fontawesome.com');
                        })}" style="cursor: pointer;" class="mx-2 fw-bold mb-1">Fontawesome</a>官網，查找ICON標籤。</div>
                    <input type="text" value="${(_e = formData[dd.key]) !== null && _e !== void 0 ? _e : ""}"
                           class="${inputClass}"
                           style="${inputStyle}" onchange="${gvc.event((e, event) => {
                            formData[dd.key] = e.value;
                            obj.refresh(dd.key);
                        })}"
                           ${readonly ? `readonly` : ``}
                    >
                </div>`;
                    case "form_plugin":
                        return gvc.bindView(() => {
                            return {
                                bind: gvc.glitter.getUUID(),
                                view: () => {
                                    return new Promise((resolve, reject) => {
                                        const url = new URL(dd.route, import.meta.url);
                                        window.glitter.getModule(url.href, (module) => {
                                            resolve(module({
                                                gvc: gvc,
                                                formData: formData,
                                                key: dd.key
                                            }));
                                        });
                                    });
                                },
                                divCreate: {
                                    class: containerClass, style: containerStyle
                                }
                            };
                        });
                    case "form_plugin_v2":
                        const form_data = formData;
                        const form_key = dd.key;
                        if (dd.hidden_code && dd.hidden_code.trim() && eval(`(() => {
                            ${dd.hidden_code}
                        })()`)) {
                            return ``;
                        }
                        return gvc.bindView(() => {
                            const tempView = gvc.glitter.getUUID();
                            return {
                                bind: tempView,
                                view: () => {
                                    return ``;
                                },
                                divCreate: {
                                    class: containerClass, style: containerStyle
                                },
                                onCreate: () => {
                                },
                                onInitial: () => {
                                    const target = gvc.glitter.document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                    (window.glitterInitialHelper).getPageData({
                                        tag: dd.page,
                                        appName: dd.appName || window.appName
                                    }, (d2) => {
                                        var _a, _b;
                                        let data = d2.response.result[0];
                                        data.config = (_a = data.config) !== null && _a !== void 0 ? _a : [];
                                        data.config.map((dd) => {
                                            glitter.htmlGenerate.renameWidgetID(dd);
                                        });
                                        let createOption = {
                                            class: containerClass, style: containerStyle,
                                        };
                                        createOption.option = (_b = createOption.option) !== null && _b !== void 0 ? _b : [];
                                        createOption.childContainer = true;
                                        data.config.formData = data.page_config.formData;
                                        let viewConfig = data.config;
                                        const id = gvc.glitter.getUUID();
                                        function getView() {
                                            function loop(array) {
                                                array.map((dd) => {
                                                    var _a;
                                                    if (dd.type === 'container') {
                                                        loop((_a = dd.data.setting) !== null && _a !== void 0 ? _a : []);
                                                    }
                                                    dd.formData = undefined;
                                                });
                                            }
                                            loop(viewConfig);
                                            return new glitter.htmlGenerate(viewConfig, [], {
                                                root_form_data: obj.widget && obj.widget.formData,
                                                form_data: formData,
                                                form_key: dd.key,
                                                form_config: dd.form_config || JSON.parse(dd.formFormat || '{}'),
                                                form_title: dd.title,
                                                refresh: () => {
                                                    obj.refresh(dd.key);
                                                }
                                            }).render(gvc, {
                                                class: containerClass, style: containerStyle,
                                                containerID: id,
                                                jsFinish: () => {
                                                },
                                                onCreate: () => {
                                                }
                                            }, createOption !== null && createOption !== void 0 ? createOption : {});
                                        }
                                        try {
                                            target && (target.outerHTML = getView());
                                        }
                                        catch (e) {
                                        }
                                    });
                                },
                            };
                        });
                    default:
                }
                return html `
                    <div class=" ${containerClass}" style="${containerStyle}">
                        ${label}
                        <input type="${dd.type}" value="${(_f = formData[dd.key]) !== null && _f !== void 0 ? _f : ""}"
                               class="${inputClass}"
                               style="${inputStyle}" onchange="${gvc.event((e, event) => {
                    formData[dd.key] = e.value;
                    obj.refresh(dd.key);
                })}"
                               placeholder="${(_g = dd.placeHolder) !== null && _g !== void 0 ? _g : ''}"
                               ${readonly ? `readonly` : ``}
                        >
                    </div>
                `;
            }).join('');
        }
        let groupList = {};
        obj.array.map((dd) => {
            var _a, _b;
            dd.group = (_a = dd.group) !== null && _a !== void 0 ? _a : "";
            groupList[dd.group] = (_b = groupList[dd.group]) !== null && _b !== void 0 ? _b : [];
            groupList[dd.group].push(dd);
        });
        return `<div class="row m-0 p-0">
${Object.keys(groupList).map((key) => {
            if (key) {
                let toggle = {};
                return `<div class="mt-2">${EditorElem.toggleExpand({
                    gvc: gvc,
                    title: key,
                    data: toggle,
                    innerText: getRaw(groupList[key])
                })}</div>`;
            }
            else {
                return getRaw(groupList[key]);
            }
        }).join('')}
</div>`;
    }
}
Plugin.createComponent(import.meta.url, (glitter, editMode) => {
    return {
        defaultData: {},
        render: (gvc, widget, setting, hoverID, subData, element) => {
            const html = String.raw;
            const config = getInitialData({
                obj: widget.data,
                key: 'layout',
                def: {
                    array: [],
                    style: {},
                    formID: 'formID',
                    getFormData: {},
                    form_config: {},
                    form_id_from: {},
                    getFormID: {},
                    refreshEvent: {},
                    containerStyle: {},
                    form_config_from: 'static'
                },
            });
            const containerStyle = glitter.htmlGenerate.editor_component((config).containerStyle, gvc, widget, subData);
            let formData = {};
            function getEditor() {
                return gvc.bindView(() => {
                    const id = gvc.glitter.getUUID();
                    return {
                        bind: id,
                        view: () => {
                            return [
                                containerStyle.editor(gvc, () => {
                                    widget.refreshComponent();
                                }),
                                EditorElem.select({
                                    title: '表單ID來源',
                                    gvc: gvc,
                                    array: [
                                        { title: '靜態', value: 'static' },
                                        { title: '動態', value: 'code' }
                                    ],
                                    def: config.form_id_from,
                                    callback: (text) => {
                                        config.form_id_from = text;
                                        gvc.notifyDataChange(id);
                                    }
                                }),
                                (() => {
                                    if (config.form_id_from === 'code') {
                                        return TriggerEvent.editer(gvc, widget, config.getFormID, {
                                            hover: false,
                                            option: [],
                                            title: "設定表單ID來源"
                                        });
                                    }
                                    else {
                                        return EditorElem.editeInput({
                                            gvc: gvc,
                                            title: '表單ID',
                                            placeHolder: `請輸入表單ID`,
                                            default: config.formID,
                                            callback: (text) => {
                                                config.formID = text;
                                                widget.refreshComponent();
                                            }
                                        });
                                    }
                                })(),
                                TriggerEvent.editer(gvc, widget, config.getFormData, {
                                    hover: false,
                                    option: [],
                                    title: "設定表單資料來源"
                                }),
                                TriggerEvent.editer(gvc, widget, config.refreshEvent, {
                                    hover: false,
                                    option: [],
                                    title: "表單更新事件"
                                }),
                                EditorElem.select({
                                    title: '表單格式來源',
                                    gvc: gvc,
                                    array: [
                                        { title: '靜態', value: 'static' },
                                        { title: '動態', value: 'code' }
                                    ],
                                    def: config.form_config_from,
                                    callback: (text) => {
                                        config.form_config_from = text;
                                        gvc.notifyDataChange(id);
                                    }
                                }),
                                (() => {
                                    if (config.form_config_from === 'code') {
                                        return TriggerEvent.editer(gvc, widget, config.form_config, {
                                            hover: false,
                                            option: [],
                                            title: "取得表單格式"
                                        });
                                    }
                                    else {
                                        return `<div class="mx-n2 ">${FormWidget.settingView({
                                            gvc: gvc,
                                            array: config.array,
                                            refresh: () => {
                                                widget.refreshComponent();
                                            },
                                            widget: widget,
                                            subData: subData
                                        })}</div>`;
                                    }
                                })()
                            ].join('<div class="my-2"></div>');
                        }
                    };
                });
            }
            return {
                view: () => {
                    return gvc.bindView(() => {
                        let form_config_list = config.array;
                        function checkEditFinish() {
                            return !form_config_list.find((dd) => {
                                return (dd.require === 'true') && (!formData[dd.key]);
                            });
                        }
                        const id = glitter.getUUID();
                        let formID = config.formID;
                        function getFormData() {
                            return __awaiter(this, void 0, void 0, function* () {
                                const data = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: config.getFormData,
                                    subData: subData,
                                    element: element
                                });
                                gvc.share[`formComponentData-${config.formID}`] = data || formData;
                                formData = gvc.share[`formComponentData-${config.formID}`];
                                if (config.form_id_from === 'code') {
                                    formID = yield TriggerEvent.trigger({
                                        gvc: gvc,
                                        widget: widget,
                                        clickEvent: config.getFormID,
                                        subData: subData,
                                        element: element
                                    });
                                }
                                gvc.notifyDataChange(id);
                                return formData;
                            });
                        }
                        let dyView = '';
                        let defineHeight = 0;
                        function getCodeView() {
                            new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                                const formConfig = yield TriggerEvent.trigger({
                                    gvc: gvc,
                                    widget: widget,
                                    clickEvent: config.form_config,
                                    subData: subData,
                                    element: element
                                });
                                form_config_list = formConfig;
                                resolve(FormWidget.editorView({
                                    gvc: gvc,
                                    array: formConfig,
                                    refresh: (key) => {
                                        TriggerEvent.trigger({
                                            gvc: gvc,
                                            widget: widget,
                                            clickEvent: config.refreshEvent,
                                            subData: subData,
                                            element: element
                                        });
                                        getCodeView();
                                    },
                                    widget: widget,
                                    subData: subData,
                                    formData: yield getFormData()
                                }));
                            })).then((dd) => {
                                dyView = dd;
                                gvc.notifyDataChange(id);
                            });
                        }
                        if (config.form_config_from === 'code') {
                            getCodeView();
                        }
                        else {
                            getFormData();
                        }
                        return {
                            bind: id,
                            view: () => {
                                if (config.form_config_from === 'code') {
                                    return dyView;
                                }
                                else {
                                    return FormWidget.editorView({
                                        gvc: gvc,
                                        array: config.array,
                                        refresh: (key) => {
                                            TriggerEvent.trigger({
                                                gvc: gvc,
                                                widget: widget,
                                                clickEvent: config.refreshEvent,
                                                subData: subData,
                                                element: element
                                            });
                                            gvc.notifyDataChange(id);
                                        },
                                        widget: widget,
                                        subData: subData,
                                        formData: formData
                                    });
                                }
                            },
                            divCreate: (() => {
                                return {
                                    class: `formID-${formID} ${containerStyle.class()}`,
                                    style: `${containerStyle.style()} ${(() => {
                                        if (defineHeight) {
                                            return `height:${defineHeight}px;`;
                                        }
                                        else {
                                            return ``;
                                        }
                                    })()}`
                                };
                            }),
                            onCreate: () => {
                                document.querySelector(`.formID-${formID}`).formValue = () => {
                                    return formData;
                                };
                                document.querySelector(`.formID-${formID}`).checkEditFinish = checkEditFinish;
                            }
                        };
                    });
                },
                editor: () => {
                    return getEditor();
                },
                user_editor: () => {
                    return getEditor();
                }
            };
        },
    };
});
const interVal = setInterval(() => {
    if (window.glitter) {
        window.glitter.setModule(import.meta.url, FormWidget);
        clearInterval(interVal);
    }
});
