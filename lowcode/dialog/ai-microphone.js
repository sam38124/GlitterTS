import { init } from '../glitterBundle/GVController.js';
import { ShareDialog } from "./ShareDialog.js";
import { BaseApi } from "../api/base.js";
import { config } from "../config.js";
init((gvc, glitter, gBundle) => {
    function getSource(dd) {
        return dd.src.official;
    }
    let configText = '';
    const textID = glitter.getUUID();
    function trigger() {
        const dialog = new ShareDialog(glitter);
        if (!configText) {
            dialog.errorMessage({ text: "請輸入描述語句" });
            return;
        }
        glitter.openDiaLog('dialog/ai-progress.js', 'ai-progress', {});
        BaseApi.create({
            "url": config.url + `/api/v1/ai/generate-html`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                "search": configText
            })
        }).then((re) => {
            glitter.closeDiaLog('ai-progress');
            if (re.result) {
                const html = document.createElement('body');
                console.log(`responseData:` + re.response.data);
                html.innerHTML = re.response.data;
                saveHTML(traverseHTML(html), '', gvc);
            }
            else {
                dialog.errorMessage({ text: "轉換失敗，請輸入其他文案" });
            }
        });
    }
    return {
        onCreateView: () => {
            let viewModel = {
                loading: true,
                pluginList: []
            };
            gvc.addMtScript([
                { src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js` }
            ], () => {
            }, () => {
            });
            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(10,10,10,0.7);" onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}">
    <lottie-player src="https://assets4.lottiefiles.com/private_files/lf30_qfbae4sb.json"    speed="1"   style="max-width: 100%;width: 500px;height:100vh;transform: translateY(-100px)"  loop  autoplay></lottie-player>
    <div class="position-absolute translate-middle-x translate-middle-y d-flex flex-column align-items-center justify-content-center" style="top:calc(50% + 100px);width:350px;" onclick="${gvc.event((e, event) => {
                event.stopPropagation();
            })}" >
    ${gvc.bindView(() => {
                return {
                    bind: textID,
                    view: () => {
                        return glitter.htmlGenerate.editeText({
                            gvc: gvc,
                            title: '',
                            default: configText !== null && configText !== void 0 ? configText : "",
                            placeHolder: `輸入或說出AI生成語句\n譬如:
        -產生一個h1，字體顏色為紅色，大小為30px．
        -產生一個商品內文．
        -使用bootstrap生成一個商品展示頁面．
        `,
                            callback: (text) => {
                                configText = text;
                            }
                        });
                    },
                    divCreate: { class: `w-100` }
                };
            })}
<div class="d-flex w-100 mt-2">
<div class="flex-fill"></div>
<button class="btn btn-warning" onclick="${gvc.event(() => {
                trigger();
            })}"><i class="fa-sharp fa-solid fa-paper-plane-top me-2"></i>開始AI生成</button>
</div>
</div>

<div class="alert alert-warning position-absolute d-none" style="bottom:20px;">
<span class="fr-strong">範例:</span><br>
<span>1.幫我生成一個H1標籤，字體大小為14px</span>
<br>
<span>2.幫我使用bootstrap產生一個美觀的登入頁面</span>
<br>
</div>
</div>
            `;
        },
        onCreate: () => {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'zh-tw';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.onresult = function (event) {
                const transcript = event.results[0][0].transcript;
                configText += transcript;
                gvc.notifyDataChange(textID);
                setTimeout(() => {
                    recognition.start();
                }, 500);
            };
            recognition.start();
        },
        onDestroy: () => {
        }
    };
});
function traverseHTML(element) {
    var _a, _b;
    var result = {};
    result.tag = element.tagName;
    var attributes = (_a = element.attributes) !== null && _a !== void 0 ? _a : [];
    if (attributes.length > 0) {
        result.attributes = {};
        for (let i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    if (element.children && element.children.length > 0) {
        result.children = [];
        var childNodes = element.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                result.children.push(traverseHTML(node));
            }
            else if (node.nodeType === Node.TEXT_NODE) {
                const html = document.createElement('span');
                html.innerHTML = node.textContent.trim();
                if (html.innerHTML) {
                    result.children.push(traverseHTML(html));
                }
            }
            else {
                if (node.tagName) {
                    result.children.push(traverseHTML(node));
                }
            }
        }
    }
    result.innerText = ((_b = element.innerText) !== null && _b !== void 0 ? _b : "").replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    return result;
}
async function saveHTML(json, relativePath, gvc, elem) {
    const dialog = new ShareDialog(gvc.glitter);
    dialog.dataLoading({ visible: true, text: "解析資源中" });
    const glitter = gvc.glitter;
    let addSheet = (elem === null || elem === void 0 ? void 0 : elem.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'style' && dd.check);
    })) || (elem === undefined);
    let addHtml = (elem === null || elem === void 0 ? void 0 : elem.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'html' && dd.check);
    })) || (elem === undefined);
    let addScript = (elem === null || elem === void 0 ? void 0 : elem.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'script' && dd.check);
    })) || (elem === undefined);
    const styleSheet = {
        "id": glitter.getUUID(),
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": { "class": {}, "style": {} },
        "data": {
            "elem": "glitterStyle",
            "dataFrom": "static",
            "atrExpand": { "expand": false },
            "elemExpand": { "expand": true },
            "innerEvenet": {},
            "setting": []
        },
        "type": "container",
        "label": "所有設計樣式",
    };
    const jsLink = {
        "id": glitter.getUUID(),
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": { "class": {}, "style": {} },
        "data": {
            "elem": "glitterJS",
            "dataFrom": "static",
            "atrExpand": { "expand": false },
            "elemExpand": { "expand": true },
            "innerEvenet": {},
            "setting": []
        },
        "type": "container",
        "label": "所有JS資源",
    };
    async function covertHtml(json, pushArray) {
        var _a, _b;
        for (const dd of (_a = json.children) !== null && _a !== void 0 ? _a : []) {
            if ((dd.tag.toLowerCase() !== 'title')) {
                dd.attributes = (_b = dd.attributes) !== null && _b !== void 0 ? _b : {};
                let originalHref = '';
                let originalSrc = '';
                try {
                    originalHref = new URL(dd.attributes.href, relativePath).href;
                }
                catch (e) {
                }
                try {
                    originalSrc = new URL(dd.attributes.src, relativePath).href;
                }
                catch (e) {
                }
                const obj = await convert(dd);
                if (obj.data.elem !== 'meta' && !(((obj.data.elem === 'link') && (dd.attributes.rel !== 'stylesheet')))) {
                    if (obj.data.elem === 'style' || ((obj.data.elem === 'link') && (dd.attributes.rel === 'stylesheet'))) {
                        if ((obj.data.elem === 'link' && (dd.attributes.rel === 'stylesheet'))) {
                            obj.data.note = "源代碼路徑:" + originalHref;
                        }
                        if (addSheet) {
                            styleSheet.data.setting.push(obj);
                        }
                    }
                    else if (obj.data.elem === 'script') {
                        if (addScript) {
                            obj.data.note = "源代碼路徑:" + originalSrc;
                            jsLink.data.setting.push(obj);
                        }
                    }
                    else if (obj.data.elem === 'image') {
                        obj.data.note = "源代碼路徑:" + originalSrc;
                    }
                    else {
                        if (addHtml) {
                            pushArray.push(obj);
                        }
                    }
                }
            }
        }
    }
    async function convert(obj) {
        var _a, _b, _c, _d, _e, _f, _g;
        obj.children = (_a = obj.children) !== null && _a !== void 0 ? _a : [];
        obj.attributes = (_b = obj.attributes) !== null && _b !== void 0 ? _b : {};
        let originalHref = obj.attributes.href;
        let originalSrc = obj.attributes.src;
        obj.innerText = (_c = obj.innerText) !== null && _c !== void 0 ? _c : "";
        const a = await new Promise((resolve, reject) => {
            try {
                if (obj.tag.toLowerCase() === 'link' && obj.attributes.rel === 'stylesheet' && addSheet) {
                    const src = obj.attributes.href;
                    const url = new URL(src, relativePath);
                    originalHref = url.href;
                    getFile(url.href).then((link) => {
                        obj.attributes.href = link;
                        resolve(true);
                    });
                }
                else if (obj.tag.toLowerCase() === 'script' && obj.attributes.src && addScript) {
                    const src = obj.attributes.src;
                    const url = new URL(src, relativePath);
                    originalSrc = url;
                    getFile(url.href).then((link) => {
                        obj.attributes.src = link;
                        resolve(true);
                    });
                }
                else if (obj.tag.toLowerCase() === 'img' && obj.attributes.src && addHtml) {
                    const src = obj.attributes.src;
                    const url = new URL(src, relativePath);
                    getFile(url.href).then((link) => {
                        obj.attributes.src = link;
                        resolve(true);
                    });
                }
                else {
                    resolve(true);
                }
            }
            catch (e) {
                resolve(true);
            }
        });
        let setting = [];
        await covertHtml(obj, setting);
        let x = {
            "id": glitter.getUUID(),
            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
            "css": { "class": {}, "style": {} },
            "data": {
                "class": (_d = obj.attributes.class) !== null && _d !== void 0 ? _d : "",
                "style": ((_e = obj.attributes.style) !== null && _e !== void 0 ? _e : ""),
                "attr": Object.keys(obj.attributes).filter((key) => {
                    return key !== 'class' && key !== 'style';
                }).map((dd) => {
                    const of = obj.attributes[dd];
                    return {
                        "attr": dd,
                        "type": "par",
                        "value": of,
                        "expand": false,
                    };
                }),
                "elem": obj.tag.toLowerCase(),
                "inner": (_f = obj.innerText) !== null && _f !== void 0 ? _f : "",
                "dataFrom": "static",
                "atrExpand": { "expand": true },
                "elemExpand": { "expand": true },
                "innerEvenet": {},
                "setting": setting
            },
            "type": (obj.children && obj.children.length > 0) ? "container" : "widget",
            "label": (() => {
                var _a;
                if (obj.tag.toLowerCase() === 'link' && (obj.attributes.rel === 'stylesheet')) {
                    return `style資源`;
                }
                const source = ['script', 'style'].indexOf(obj.tag.toLowerCase());
                if (source >= 0) {
                    return ['script資源', 'style資源'][source];
                }
                let lab = (_a = obj.innerText) !== null && _a !== void 0 ? _a : ((obj.type === 'container') ? `HTML容器` : `HTML元件`);
                lab = lab.trim().replace(/&nbsp;/g, '');
                if (lab.length > 10) {
                    return lab.substring(0, 10);
                }
                else {
                    if (lab.length === 0) {
                        return ((obj.type === 'container') ? `HTML容器` : `HTML元件`);
                    }
                    else {
                        return lab;
                    }
                }
            })(),
            "styleList": []
        };
        if (x.data.style.length > 0) {
            x.data.style += ";";
        }
        if (x.data.elem === 'img') {
            x.data.inner = ((_g = x.data.attr.find((dd) => {
                return dd.attr === 'src';
            })) !== null && _g !== void 0 ? _g : { value: "" }).value;
            x.data.attr = x.data.attr.filter((dd) => {
                return dd.attr !== 'src';
            });
        }
        if ((x.data.elem === 'html') || (x.data.elem === 'head')) {
            x.data.elem = 'div';
        }
        return new Promise((resolve, reject) => {
            resolve(x);
        });
    }
    let waitPush = [];
    await covertHtml(json, waitPush);
    if (styleSheet.data.setting.length > 0) {
        styleSheet.data.setting.map((dd) => {
            gvc.getBundle().callback(dd);
        });
    }
    if (jsLink.data.setting.length > 0) {
        jsLink.data.setting.map((dd) => {
            gvc.getBundle().callback(dd);
        });
    }
    waitPush.map((obj) => {
        gvc.getBundle().callback(obj);
    });
    setTimeout((() => {
        dialog.dataLoading({ visible: false });
        glitter.closeDiaLog();
    }), 1000);
}
function getFile(href) {
    const glitter = window.glitter;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: config.url + "/api/v1/fileManager/getCrossResource",
            type: 'post',
            data: JSON.stringify({
                "url": href
            }),
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            crossDomain: true,
            processData: false,
            success: (data2) => {
                resolve(data2.url);
            },
            error: (err) => {
                resolve(href);
            }
        });
    });
}
