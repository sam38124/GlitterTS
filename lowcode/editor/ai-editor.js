var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Storage } from '../glitterBundle/helper/storage.js';
import { AiChat } from "../glitter-base/route/ai-chat.js";
export class AiEditor {
    static editView(text, items, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const og_schema = yield AiEditor.getRequestConfig((items.type === 'component') ? items.data.tag : '', items);
            AiChat.editorHtml({
                text: text,
                format: {
                    "name": "html_element_modification",
                    "strict": true,
                    "schema": (() => {
                        const schema = JSON.parse(JSON.stringify(og_schema));
                        schema.required.map((dd) => {
                            console.log(`schema.properties[dd]=>`, schema.properties[dd]);
                            schema.properties[dd].event = undefined;
                        });
                        return schema;
                    })()
                },
                assistant: ''
            }).then((dd) => {
                var _a, _b;
                if (!dd.result || !dd.response.result) {
                    callback(false);
                }
                else {
                    const obj = dd.response.data.obj;
                    const data = (() => {
                        if (Storage.view_type === 'mobile') {
                            return items.mobile_editable.find((dd) => {
                                return dd === '_container_margin';
                            }) ? items.mobile.data : items.data;
                        }
                        else {
                            return items.desktop_editable.find((dd) => {
                                return dd === '_container_margin';
                            }) ? items.desktop.data : items.data;
                        }
                    })();
                    for (const b of ['margin_left', 'margin_right', 'margin_top', 'margin_bottom']) {
                        data._padding = data._padding || {};
                        if (obj[b] && !obj[b].includes('none')) {
                            switch (b) {
                                case 'margin_left':
                                    data._padding.left = obj[b].replace('px', '');
                                    break;
                                case 'margin_right':
                                    data._padding.right = obj[b].replace('px', '');
                                    break;
                                case 'margin_top':
                                    data._padding.top = obj[b].replace('px', '');
                                    break;
                                case 'margin_bottom':
                                    data._padding.bottom = obj[b].replace('px', '');
                                    break;
                            }
                        }
                        console.log(`data._padding.==>`, data._padding);
                    }
                    if (obj.width && !obj.width.includes('none')) {
                        data._max_width = (_a = data._max_width) !== null && _a !== void 0 ? _a : '';
                        data._max_width = data._max_width.replace('px', '');
                    }
                    if (obj.height && !obj.height.includes('none')) {
                        data._max_height = (_b = data._max_height) !== null && _b !== void 0 ? _b : '';
                        data._max_height = data._max_height.replace('px', '');
                    }
                    if (obj.background && !obj.background.includes('none')) {
                        data._background_setting = { "type": "color", "value": `${obj.background}` };
                    }
                    Object.keys(obj).map((ch) => {
                        if (obj[ch] && !`${obj[ch]}`.includes('none') && og_schema.properties[ch].event) {
                            og_schema.properties[ch].event(ch, obj[ch]);
                        }
                    });
                    callback(obj.fix_what);
                }
            });
        });
    }
    static getRequestConfig(label, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = {
                "type": "object",
                "properties": {
                    "background": {
                        "type": "string",
                        "description": "背景顏色的色號，格式為HEX，未輸入則為none"
                    },
                    "margin_left": {
                        "type": "string",
                        "description": "左側間隔距離，未輸入則為none"
                    },
                    "margin_right": {
                        "type": "string",
                        "description": "右側間隔距離，未輸入則為none"
                    },
                    "margin_top": {
                        "type": "string",
                        "description": "上方間隔距離，未輸入則為none"
                    },
                    "margin_bottom": {
                        "type": "string",
                        "description": "下方間隔距離，未輸入則為none"
                    },
                    "result": {
                        "type": "boolean",
                        "description": "是否有成功執行"
                    },
                    "fix_what": {
                        "type": "string",
                        "description": "修改了哪些項目"
                    },
                    "width": {
                        "type": "string",
                        "description": "修改寬度，單位為px、%或vw，未輸入則為none"
                    },
                    "height": {
                        "type": "string",
                        "description": "修改高度，單位為px、%或vw，未輸入則為none"
                    }
                },
                "required": [
                    "margin_left",
                    "width",
                    "height",
                    "margin_right",
                    "margin_top",
                    "margin_bottom",
                    "result",
                    "background",
                    "fix_what"
                ],
                "additionalProperties": false
            };
            let formFormat = [];
            if (label) {
                formFormat = yield new Promise((resolve, reject) => {
                    window.glitterInitialHelper.getPageData({
                        tag: label,
                        appName: items.data.refer_app
                    }, (d2) => {
                        const pageData = d2.response.result[0];
                        console.log(`pageData==>`, pageData);
                        const page_config = pageData.page_config;
                        resolve(page_config.formFormat);
                    });
                });
            }
            function changeValue(key, value) {
                if (items[`${Storage.view_type}_editable`].find((d1) => {
                    return d1 === key;
                })) {
                    items[Storage.view_type].data.refer_form_data[key] = value;
                }
                else {
                    items.data.refer_form_data[key] = value;
                }
            }
            console.log(`formFormat==>`, formFormat);
            switch (label) {
                case 'basic-title':
                case 'content':
                    (() => {
                        const b = [
                            {
                                key: 'title',
                                type: 'string',
                                description: '標題或內文，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                            {
                                key: "size_pc",
                                type: 'string',
                                description: '字體大小，範圍為0到100，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data.replace('px', ''));
                                }
                            },
                            {
                                key: "weight",
                                type: 'string',
                                "enum": [
                                    "100",
                                    "200",
                                    "300",
                                    "400",
                                    "500",
                                    "600",
                                    "700",
                                    "none"
                                ],
                                description: '字體粗細度，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                            {
                                key: "letter_space",
                                type: 'string',
                                description: '文字間隔距離，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                            {
                                key: 'justify',
                                type: 'string',
                                "enum": [
                                    "left",
                                    "center",
                                    "right",
                                    "none"
                                ],
                                description: '元素位置，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                            {
                                key: "import_",
                                type: 'string',
                                "enum": [
                                    "true",
                                    "false",
                                    "none"
                                ],
                                description: '是否為重點標題，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                            {
                                key: "auto_next",
                                type: 'string',
                                "enum": [
                                    "true",
                                    "false",
                                    "none"
                                ],
                                description: '是否自動換行，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                            {
                                key: "color",
                                type: 'string',
                                description: '字體顏色的色號，格式為HEX，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, {
                                        "id": "custom-color",
                                        "title": data,
                                        "content": "#000000",
                                        "sec-title": "#000000",
                                        "background": "#ffffff",
                                        "sec-background": "#FFFFFF",
                                        "solid-button-bg": "#000000",
                                        "border-button-bg": "#000000",
                                        "solid-button-text": "#ffffff",
                                        "border-button-text": "#000000"
                                    });
                                }
                            },
                        ];
                        b.map((d) => {
                            schema.required.push(d.key);
                            schema.properties[d.key] = {
                                type: d.type,
                                description: d.description,
                                enum: d.enum,
                                event: d.event
                            };
                        });
                    })();
                    break;
                case 'sy00-btn':
                    (() => {
                        const theme = {
                            "id": "custom-theme",
                            "solid-button-bg": "#000000",
                            "solid-button-text": "#ffffff"
                        };
                        const b = [
                            {
                                key: "btn_bg",
                                type: 'string',
                                description: '按鈕背景顏色的色號，格式為HEX，未輸入則為none',
                                event: (key, data) => {
                                    theme["solid-button-bg"] = data;
                                    changeValue("theme", theme);
                                }
                            },
                            {
                                key: "btn_text",
                                type: 'string',
                                description: '按鈕字體顏色的色號，格式為HEX，未輸入則為none',
                                event: (key, data) => {
                                    theme["solid-button-text"] = data;
                                    changeValue("theme", theme);
                                }
                            },
                            {
                                key: 'title',
                                type: 'string',
                                description: '按鈕標題或內文，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                            {
                                key: "font-size",
                                type: 'number',
                                description: '字體大小，範圍為0到100，未輸入則為0',
                                event: (key, data) => {
                                    changeValue(key, data.replace('px', ''));
                                }
                            },
                            {
                                key: "btn_width",
                                type: 'number',
                                description: '按鈕寬度，未輸入則為0',
                                event: (key, data) => {
                                    changeValue('width', { "unit": "px", "value": `${data}px`, "number": `${data}` });
                                }
                            },
                            {
                                key: "btn_height",
                                type: 'number',
                                description: '按鈕高度，未輸入則為0',
                                event: (key, data) => {
                                    changeValue('height', { "unit": "px", "value": `${data.replace('px', '')}px`, "number": data.replace('px', '') });
                                }
                            },
                            {
                                key: "radius",
                                type: 'string',
                                description: '按鈕圓角，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data.replace('px', ''));
                                }
                            },
                            {
                                key: "link",
                                type: 'string',
                                description: '按鈕連結，未輸入則為none',
                                event: (key, data) => {
                                    changeValue(key, data);
                                }
                            },
                        ];
                        b.map((d) => {
                            schema.required.push(d.key);
                            schema.properties[d.key] = {
                                type: d.type,
                                description: d.description,
                                enum: d.enum,
                                event: d.event
                            };
                        });
                    })();
                    break;
            }
            return schema;
        });
    }
}
window.glitter.setModule(import.meta.url, AiEditor);
