import { Plugin } from "../../glitterBundle/plugins/plugin-creater.js";
import { TriggerEvent } from "../../glitterBundle/plugins/trigger-event.js";
import { EditorElem } from "../../glitterBundle/plugins/editor-elem.js";
import { getInitialData } from "../initial_data.js";
import autosize from "../../glitterBundle/plugins/autosize.js";
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
                        innerHtml: (gvc) => {
                            const labelCSS = glitter.htmlGenerate.editor_component(dd.style_data.label, gvc, obj.widget, obj.subData);
                            const inputCSS = glitter.htmlGenerate.editor_component(dd.style_data.input, gvc, obj.widget, obj.subData);
                            const containerCss = glitter.htmlGenerate.editor_component(dd.style_data.container, gvc, obj.widget, obj.subData);
                            return [
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: 'Label名稱',
                                    placeHolder: `請輸入Label名稱`,
                                    default: dd.title,
                                    callback: (text) => {
                                        dd.title = text;
                                        obj.refresh();
                                    }
                                }),
                                EditorElem.select({
                                    title: "元件類型",
                                    gvc: gvc,
                                    def: dd.type,
                                    array: [
                                        { title: '文字', value: 'text' },
                                        { title: '信箱', value: 'email' },
                                        { title: '電話', value: 'phone' },
                                        { title: '顏色', value: 'color' },
                                        { title: '數字', value: 'number' },
                                        { title: '名稱', value: 'name' },
                                        { title: '日期', value: 'date' },
                                        { title: '時間', value: 'time' },
                                        { title: 'ICON選擇', value: 'fontawesome' },
                                        { title: '多行文字區塊', value: 'textArea' },
                                        { title: '地址', value: 'address' },
                                        { title: '密碼', value: 'password' },
                                        { title: '多項列表元件', value: 'array' },
                                        { title: '檔案上傳', value: 'file' },
                                        { title: '選擇器', value: 'select' },
                                        { title: '頁面選擇器', value: 'page_select' },
                                        { title: '表單插件', value: 'form_plugin_v2' },
                                    ],
                                    callback: (text) => {
                                        dd.type = text;
                                        gvc.recreateView();
                                        obj.refresh();
                                    }
                                }),
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
                                EditorElem.editeInput({
                                    gvc: gvc,
                                    title: '設定群組',
                                    placeHolder: `為空則不設定`,
                                    default: dd.group,
                                    callback: (text) => {
                                        dd.group = text;
                                        obj.refresh();
                                    }
                                }),
                                ...(() => {
                                    var _a;
                                    if (dd.type === 'form_plugin') {
                                        return [
                                            EditorElem.editeInput({
                                                gvc: gvc,
                                                title: '插件路徑',
                                                placeHolder: `請輸入插件路徑`,
                                                default: dd.route,
                                                callback: (text) => {
                                                    dd.route = text;
                                                    obj.refresh();
                                                }
                                            })
                                        ];
                                    }
                                    else if (dd.type === 'form_plugin_v2') {
                                        dd.formFormat = (_a = dd.formFormat) !== null && _a !== void 0 ? _a : '';
                                        return [EditorElem.pageSelect(gvc, '選擇表單插件', dd.page, (data) => {
                                                dd.page = data;
                                            }, (dd) => {
                                                return dd.page_type === 'form_plugin';
                                            }), EditorElem.customCodeEditor({
                                                gvc: gvc,
                                                height: 400,
                                                initial: dd.formFormat,
                                                title: 'Config配置檔',
                                                callback: (data) => {
                                                    dd.formFormat = data;
                                                },
                                                language: 'json'
                                            })];
                                    }
                                    else {
                                        return [
                                            EditorElem.select({
                                                title: "顯示狀態",
                                                gvc: gvc,
                                                def: dd.readonly,
                                                array: [
                                                    { title: '唯獨', value: 'read' },
                                                    { title: '可寫', value: 'write' },
                                                    { title: '隱藏', value: 'block' },
                                                ],
                                                callback: (text) => {
                                                    dd.readonly = text;
                                                    obj.refresh();
                                                }
                                            }),
                                            EditorElem.select({
                                                title: "是否必填",
                                                gvc: gvc,
                                                def: dd.require,
                                                array: [
                                                    { title: '是', value: 'true' },
                                                    { title: '否', value: 'false' }
                                                ],
                                                callback: (text) => {
                                                    dd.require = text;
                                                    obj.refresh();
                                                }
                                            }),
                                            ...(() => {
                                                var _a, _b;
                                                if (dd.type === 'array') {
                                                    return [];
                                                }
                                                else {
                                                    return [
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '設定預設值',
                                                            placeHolder: `請輸入預設值`,
                                                            default: (_a = dd.def) !== null && _a !== void 0 ? _a : '',
                                                            callback: (text) => {
                                                                dd.def = text;
                                                                obj.refresh();
                                                            }
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '設定Placeholder',
                                                            placeHolder: `請輸入Placeholder`,
                                                            default: (_b = dd.placeHolder) !== null && _b !== void 0 ? _b : '',
                                                            callback: (text) => {
                                                                dd.placeHolder = text;
                                                                obj.refresh();
                                                            }
                                                        })
                                                    ];
                                                }
                                            })(),
                                            ...(() => {
                                                if (dd.type === 'array') {
                                                    return [
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '選項標題參照',
                                                            placeHolder: `請輸入選項標題參照`,
                                                            default: dd.referTitile,
                                                            callback: (text) => {
                                                                dd.referTitile = text;
                                                                obj.refresh();
                                                            }
                                                        }),
                                                        EditorElem.editeInput({
                                                            gvc: gvc,
                                                            title: '添加按鈕標題',
                                                            placeHolder: `請輸入添加按鈕標題`,
                                                            default: dd.plusBtn,
                                                            callback: (text) => {
                                                                dd.plusBtn = text;
                                                                obj.refresh();
                                                            }
                                                        }),
                                                        EditorElem.editerDialog({
                                                            gvc: gvc,
                                                            dialog: (gvc) => {
                                                                var _a;
                                                                dd.formList = (_a = dd.formList) !== null && _a !== void 0 ? _a : [];
                                                                return `<div class="m-n2">${FormWidget.settingView({
                                                                    gvc: gvc,
                                                                    array: dd.formList,
                                                                    refresh: () => {
                                                                        gvc.recreateView();
                                                                    },
                                                                    widget: obj.widget,
                                                                    subData: obj.subData,
                                                                })}</div>`;
                                                            },
                                                            width: '400px',
                                                            editTitle: "編輯多項列表"
                                                        })
                                                    ];
                                                }
                                                else if (dd.type === 'select') {
                                                    return [
                                                        EditorElem.editerDialog({
                                                            gvc: gvc,
                                                            dialog: (gvc) => {
                                                                var _a;
                                                                dd.formList = (_a = dd.formList) !== null && _a !== void 0 ? _a : [];
                                                                return gvc.bindView(() => {
                                                                    const id = glitter.getUUID();
                                                                    return {
                                                                        bind: id,
                                                                        view: () => {
                                                                            return EditorElem.arrayItem({
                                                                                gvc: gvc,
                                                                                title: '',
                                                                                array: () => {
                                                                                    return dd.formList.map((dd, index) => {
                                                                                        return {
                                                                                            title: dd.title || `選項 : ${index + 1}`,
                                                                                            innerHtml: (gvc) => {
                                                                                                return [
                                                                                                    EditorElem.editeInput({
                                                                                                        gvc: gvc,
                                                                                                        title: '選項標題',
                                                                                                        placeHolder: `選項標題`,
                                                                                                        default: dd.title,
                                                                                                        callback: (text) => {
                                                                                                            dd.title = text;
                                                                                                            obj.refresh();
                                                                                                        }
                                                                                                    }),
                                                                                                    EditorElem.editeInput({
                                                                                                        gvc: gvc,
                                                                                                        title: 'Key',
                                                                                                        placeHolder: `請輸入選項索引`,
                                                                                                        default: dd.key,
                                                                                                        callback: (text) => {
                                                                                                            dd.key = text;
                                                                                                            obj.refresh();
                                                                                                        }
                                                                                                    }),
                                                                                                ].join(`<div class="my-2"></div>`);
                                                                                            }
                                                                                        };
                                                                                    });
                                                                                },
                                                                                originalArray: dd.formList,
                                                                                expand: {},
                                                                                refreshComponent: () => {
                                                                                    gvc.notifyDataChange(id);
                                                                                },
                                                                                plus: {
                                                                                    title: "新增選項",
                                                                                    event: gvc.event(() => {
                                                                                        dd.formList.push({});
                                                                                        gvc.notifyDataChange(id);
                                                                                    })
                                                                                }
                                                                            });
                                                                        },
                                                                        divCreate: {
                                                                            class: `m-n2`
                                                                        }
                                                                    };
                                                                });
                                                            },
                                                            width: '400px',
                                                            editTitle: "編輯多項列表"
                                                        })
                                                    ];
                                                }
                                                else {
                                                    return [];
                                                }
                                            })(),
                                            ...(() => {
                                                if (obj.styleSetting === false) {
                                                    return [];
                                                }
                                                if (dd.type === 'array') {
                                                    return [
                                                        containerCss.editor(gvc, () => {
                                                            obj.refresh();
                                                        }, '容器樣式'),
                                                        inputCSS.editor(gvc, () => {
                                                            obj.refresh();
                                                        }, '添加按鈕樣式'),
                                                        containerCss.editor(gvc, () => {
                                                            obj.refresh();
                                                        }, '容器樣式')
                                                    ];
                                                }
                                                else {
                                                    return [
                                                        labelCSS.editor(gvc, () => {
                                                            obj.refresh();
                                                        }, 'Label樣式'),
                                                        inputCSS.editor(gvc, () => {
                                                            obj.refresh();
                                                        }, '輸入框樣式'),
                                                        containerCss.editor(gvc, () => {
                                                            obj.refresh();
                                                        }, '容器樣式')
                                                    ];
                                                }
                                            })(),
                                            ...(() => {
                                                var _a;
                                                return (_a = (obj.concat && obj.concat(dd))) !== null && _a !== void 0 ? _a : [];
                                            })()
                                        ];
                                    }
                                })()
                            ].join('<div class="my-2"></div>') + `<div class="my-2"></div>`;
                        },
                        expand: dd,
                        minus: gvc.event(() => {
                            array.splice(index, 1);
                            obj.refresh();
                        })
                    };
                });
            },
            originalArray: array,
            expand: {},
            plus: {
                title: "新增選項",
                event: gvc.event((e, event) => {
                    array.push({
                        title: '標題',
                        key: '',
                        readonly: 'write',
                        type: 'text',
                        require: 'true',
                        style_data: {
                            label: {
                                class: `form-label fs-base `,
                                style: ``
                            },
                            input: {
                                class: ``,
                                style: ``
                            },
                            container: {
                                class: ``,
                                style: ``
                            }
                        }
                    });
                    obj.refresh();
                })
            },
            refreshComponent: () => {
                obj.refresh();
            }
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
                const containerClass = (_a = containerCss.class()) !== null && _a !== void 0 ? _a : ``;
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
                                }
                            };
                        });
                    case "form_plugin_v2":
                        return gvc.bindView(() => {
                            const tempView = gvc.glitter.getUUID();
                            return {
                                bind: tempView,
                                view: () => { return ``; },
                                divCreate: {},
                                onCreate: () => {
                                },
                                onInitial: () => {
                                    const target = document.querySelector(`[gvc-id="${gvc.id(tempView)}"]`);
                                    (window.glitterInitialHelper).getPageData(dd.page, (d2) => {
                                        var _a, _b;
                                        let data = d2.response.result[0];
                                        data.config = (_a = data.config) !== null && _a !== void 0 ? _a : [];
                                        data.config.map((dd) => {
                                            glitter.htmlGenerate.renameWidgetID(dd);
                                        });
                                        let createOption = {};
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
                                                form_data: formData,
                                                form_key: dd.key,
                                                form_config: JSON.parse(dd.formFormat || '{}'),
                                                form_title: dd.title
                                            }).render(gvc, {
                                                class: ``,
                                                style: ``,
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
                                }
                            };
                        });
                    default:
                }
                return html `
                <div class="${containerClass}" style="${containerStyle}">
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
        return Object.keys(groupList).map((key) => {
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
        }).join('');
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
                    array: [
                        {
                            title: '標題', key: '', readonly: 'read', type: 'text', require: "true",
                            style_data: {
                                label: {
                                    class: `form-label fs-base `,
                                    style: ``
                                },
                                input: {
                                    class: ``,
                                    style: ``
                                },
                                container: {
                                    class: ``,
                                    style: ``
                                }
                            }
                        }
                    ],
                    style: {},
                    formID: 'formID',
                    getFormData: {},
                    containerStyle: {}
                },
            });
            const containerStyle = glitter.htmlGenerate.editor_component((config).containerStyle, gvc, widget, subData);
            let formData = {};
            function getEditor() {
                return [
                    containerStyle.editor(gvc, () => {
                        widget.refreshComponent();
                    }),
                    EditorElem.editeInput({
                        gvc: gvc,
                        title: '表單ID',
                        placeHolder: `請輸入表單ID`,
                        default: config.formID,
                        callback: (text) => {
                            config.formID = text;
                            widget.refreshComponent();
                        }
                    }),
                    TriggerEvent.editer(gvc, widget, config.getFormData, {
                        hover: false,
                        option: [],
                        title: "設定表單資料來源。"
                    }),
                    `<div class="mx-n2 ">${FormWidget.settingView({
                        gvc: gvc,
                        array: config.array,
                        refresh: () => {
                            widget.refreshComponent();
                        },
                        widget: widget,
                        subData: subData
                    })}</div>`
                ].join('<div class="my-2"></div>');
            }
            return {
                view: () => {
                    return gvc.bindView(() => {
                        function checkEditFinish() {
                            return !config.array.find((dd) => {
                                return (dd.require === 'true') && (!formData[dd.key]);
                            });
                        }
                        const id = glitter.getUUID();
                        TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: config.getFormData,
                            subData: subData,
                            element: element
                        }).then((data) => {
                            gvc.share[`formComponentData-${config.formID}`] = data || formData;
                            formData = gvc.share[`formComponentData-${config.formID}`];
                            gvc.notifyDataChange(id);
                        });
                        return {
                            bind: id,
                            view: () => {
                                return FormWidget.editorView({
                                    gvc: gvc,
                                    array: config.array,
                                    refresh: (key) => {
                                        gvc.notifyDataChange(id);
                                    },
                                    widget: widget,
                                    subData: subData,
                                    formData: formData
                                });
                            },
                            divCreate: {
                                class: `formID-${config.formID} ${containerStyle.class()}`,
                                style: `${containerStyle.style()}`
                            },
                            onCreate: () => {
                                document.querySelector(`.formID-${config.formID}`).formValue = () => {
                                    return formData;
                                };
                                document.querySelector(`.formID-${config.formID}`).checkEditFinish = checkEditFinish;
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
