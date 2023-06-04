import { init } from '../glitterBundle/GVController.js';
import { ApiPageConfig } from "../api/pageConfig.js";
import { BaseApi } from "../api/base.js";
import { config } from "../config.js";
import { ShareDialog } from "../dialog/ShareDialog.js";
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const style = {
                style1: `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;`,
                style2: `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;`
            };
            return `

<div class="100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);">
<div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;">
  <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4 " >選擇類型</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                glitter.closeDiaLog();
            })}"></i>
</div>    
<div class="row m-2">
<div class="border-0 text-center col-6 col-sm-6 bg-none d-flex flex-column align-items-center justify-content-center" >
<div class="rounded-circle d-flex align-items-center justify-content-center" style="height: 100px;width: 100px; background:whitesmoke;" onclick="${gvc.event(() => {
                gvc.getBundle().callback({
                    'id': glitter.getUUID(),
                    "data": {
                        "attr": [],
                        "elem": "style",
                        "inner": "/***請輸入設計代碼***/",
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    'type': 'widget',
                    'label': 'style代碼',
                    'js': '$style1/official.js'
                });
                glitter.closeDiaLog();
            })}">
<i class="fa-solid fa-code   fs-2" style="${style.style1}"></i>
</div>
  <h5 class="fw-medium fs-lg mb-1  mt-2" style="${style.style1}">Style區塊</h5>
</div>
<div class="border-0 text-center col-6 col-sm-6 bg-none d-flex flex-column align-items-center justify-content-center"  >
<div class="rounded-circle d-flex align-items-center justify-content-center" style="height: 100px;width: 100px; background:whitesmoke;" onclick="${gvc.event(() => {
                gvc.getBundle().callback({
                    "id": glitter.getUUID(),
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": { "class": {}, "style": {} },
                    "data": {
                        "class": "",
                        "style": "",
                        "attr": [{
                                "attr": "href",
                                "type": "par",
                                "value": "",
                                "expand": false
                            }, { "attr": "rel", "type": "par", "value": "stylesheet", "expand": false }],
                        "elem": "link",
                        "inner": "",
                        "dataFrom": "static",
                        "atrExpand": { "expand": true },
                        "elemExpand": { "expand": true },
                        "innerEvenet": {},
                        "setting": [],
                        "note": ""
                    },
                    "type": "widget",
                    "label": "stylesheet",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                });
                glitter.closeDiaLog();
            })}">
<i class="fa-solid fa-link   fs-2" style="${style.style2}"></i>
</div>
  <h5 class="fw-medium fs-lg mb-1  mt-2" style="${style.style2}">資源連結</h5>
</div>
</div>
</div>
</div>
`;
        }
    };
});
function cAdd(gvc) {
    gvc.addStyle(`.nav {
  white-space: nowrap;
  display:block!important;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch
}
.nav li {
  display: inline-block
}`);
    function getSource(dd) {
        return dd.src.official;
    }
    let viewModel = {
        loading: true,
        pluginList: []
    };
    async function loading() {
        viewModel.loading = true;
        const data = await ApiPageConfig.getPlugin(gvc.getBundle().appName);
        if (data.result) {
            viewModel.loading = false;
            viewModel.pluginList = data.response.data.pagePlugin;
            gvc.notifyDataChange([tabID, docID]);
        }
    }
    loading();
    const glitter = gvc.glitter;
    const tabID = glitter.getUUID();
    const docID = glitter.getUUID();
    return ` <div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;width: 720px;height: 800px;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4 " >選擇元件</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
        glitter.closeDiaLog();
    })}"></i>
</div>    
${gvc.bindView({
        bind: tabID,
        view: () => {
            if (viewModel.loading) {
                return ``;
            }
            return gvc.map(viewModel.pluginList.map((dd, index) => {
                var _a;
                viewModel.selectSource = (_a = viewModel.selectSource) !== null && _a !== void 0 ? _a : getSource(dd);
                return `
                 <li class="nav-item">
    <a class="nav-link ${(viewModel.selectSource === getSource(dd)) ? `active` : ``}" onclick="${gvc.event(() => {
                    viewModel.selectSource = getSource(dd);
                    gvc.notifyDataChange([docID, tabID]);
                })}">${dd.name}</a>
  </li>
                `;
            }));
        },
        divCreate: { class: `nav nav-tabs border-bottom px-2 pt-2` }
    })}
<div class="container w-100 pt-2 overflow-scroll" style="height: calc(100% - 180px);">
${gvc.bindView({
        bind: docID,
        view: () => {
            function tryReturn(fun, defaults) {
                try {
                    return fun();
                }
                catch (e) {
                    return defaults;
                }
            }
            if (!viewModel.selectSource) {
                return ``;
            }
            const obg = glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource)];
            if (!obg) {
                return ``;
            }
            return gvc.map(Object.keys(glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource)]).filter((dd) => {
                return dd !== 'document';
            }).map((dd) => {
                return `
<div class="col-4 p-2">
<div class="card card-hover ">
  <div class="card-body">
    <h5 class="card-title">${tryReturn(() => {
                    return obg[dd].title;
                }, dd)}</h5>
    <p class="card-text fs-sm" style="white-space: normal;word-break: break-word;overflow-x: hidden;text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
">${tryReturn(() => {
                    return obg[dd].subContent;
                }, '')}</p>
    <a onclick="${gvc.event(() => {
                    var _a;
                    const ob = JSON.parse(JSON.stringify(obg));
                    gvc.getBundle().callback({
                        'id': glitter.getUUID(),
                        'data': (_a = ob[dd].defaultData) !== null && _a !== void 0 ? _a : {},
                        'style': ob[dd].style,
                        'class': ob[dd].class,
                        'type': dd,
                        'label': tryReturn(() => {
                            return ob[dd].title;
                        }, dd),
                        'js': viewModel.selectSource
                    });
                    glitter.closeDiaLog();
                })}" class="btn btn-sm btn-primary w-100">插入</a>
  </div>
</div>
</div>
                
                `;
            }));
        },
        divCreate: {
            class: `row w-100 p-0 m-0`
        },
        onCreate: () => {
            if (viewModel.selectSource) {
                if (!glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource)]) {
                    glitter.addMtScript([
                        { src: glitter.htmlGenerate.resourceHook(viewModel.selectSource), type: 'module' }
                    ], () => {
                        gvc.notifyDataChange(docID);
                    }, () => {
                    });
                }
            }
        }
    })}
</div>

</div>`;
}
function codeEditor(gvc) {
    const glitter = gvc.glitter;
    let code = '';
    let relativePath = '';
    let copyElem = [
        {
            elem: 'all',
            title: '全部',
            check: true
        },
        {
            elem: 'html',
            title: 'Html標籤',
            check: false
        }, {
            elem: 'style',
            title: 'Style',
            check: false
        }, {
            elem: 'script',
            title: 'Script',
            check: false
        }
    ];
    return `<div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;width:480px;">
  <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4" >代碼複製</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
        glitter.closeDiaLog();
    })}"></i>
</div>    
<!-- Your code -->
<div class="p-2">
<div>
${EditorElem.h3("複製的項目")}
${gvc.bindView(() => {
        const id = glitter.getUUID();
        return {
            bind: id,
            view: () => {
                return copyElem.map((dd) => {
                    return `<div class="form-check form-check-inline">
  <input id="check-${dd.elem}"  class="form-check-input" type="checkbox"  onchange="${gvc.event((e, event) => {
                        if ((dd.elem === 'all')) {
                            copyElem.map((dd) => {
                                dd.check = false;
                            });
                        }
                        copyElem.find((dd) => {
                            return dd.elem === 'all';
                        }).check = false;
                        if (copyElem.filter((dd) => {
                            return dd.check;
                        }).length > 1) {
                            dd.check = !dd.check;
                        }
                        else {
                            dd.check = true;
                        }
                        gvc.notifyDataChange(id);
                    })}" ${(dd.check) ? `checked` : ``}>
  <label class="form-check-label" for="check-${dd.elem}">${dd.title}</label>
</div>`;
                }).join('');
            },
            divCreate: { class: `d-flex flex-wrap` }
        };
    })}
</div>
${glitter.htmlGenerate.editeInput({
        gvc: gvc,
        title: `資源相對路徑`,
        default: relativePath,
        placeHolder: `請輸入資源相對路徑-[為空則以當前網址作為相對路徑]`,
        callback: (text) => {
            relativePath = text;
        }
    })}
${glitter.htmlGenerate.editeText({
        gvc: gvc,
        title: '複製的代碼內容',
        default: code,
        placeHolder: `請輸入HTML代碼`,
        callback: (text) => {
            code = text;
        }
    })}
</div>

<div class="d-flex p-2 align-content-end justify-content-end">
<button class="btn btn-warning text-dark " onclick="${gvc.event(() => {
        const html = document.createElement('body');
        html.innerHTML = code;
        saveHTML(traverseHTML(html), relativePath, gvc, copyElem);
    })}"><i class="fa-regular fa-floppy-disk me-2"></i> 儲存</button>
</div>
</div>`;
}
function aiEditor(gvc) {
    const glitter = gvc.glitter;
    let code = '';
    return `<div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;width:480px;">
  <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4" >請輸入AI描述語句</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
        glitter.closeDiaLog();
    })}"></i>
</div>    
<!-- Your code -->
<div class="p-2">
${glitter.htmlGenerate.editeText({
        gvc: gvc,
        title: '',
        default: '',
        placeHolder: `請輸入AI描述語句\n譬如:
        -產生一個標題，字體顏色為紅色，大小為30px．
        -產生一個商品內文．
        -使用bootstrap生成一個商品展示頁面．
        `,
        callback: (text) => {
            code = text;
        }
    })}
</div>
<div class="d-flex p-2 align-content-end justify-content-end">
<button class="btn btn-warning text-dark " onclick="${gvc.event(() => {
        const dialog = new ShareDialog(glitter);
        if (!code) {
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
                "search": code
            })
        }).then((re) => {
            glitter.closeDiaLog('ai-progress');
            if (re.result) {
                const html = document.createElement('body');
                html.innerHTML = re.response.data;
                saveHTML(traverseHTML(html), '', gvc);
            }
            else {
                dialog.errorMessage({ text: "轉換失敗，請輸入其他文案" });
            }
        });
    })}"><i class="fa-regular fa-floppy-disk me-2"></i> 儲存</button>
</div>
</div>`;
}
function traverseHTML(element) {
    var result = {};
    result.tag = element.tagName;
    var attributes = element.attributes;
    if (attributes.length > 0) {
        result.attributes = {};
        for (var i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    let children = element.children;
    if (children.length > 0) {
        result.children = [];
        for (let j = 0; j < children.length; j++) {
            result.children.push(traverseHTML(children[j]));
        }
    }
    let trimmedStr = element.innerHTML.replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    let trimmedStr2 = element.innerText.replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    result.textIndex = trimmedStr.indexOf(trimmedStr2);
    result.innerText = element.innerText.replace(/\n/, '').replace(/^\s+|\s+$/g, "");
    return result;
}
async function saveHTML(json, relativePath, gvc, elem) {
    var _a;
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
    async function convert(obj) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        obj.children = (_a = obj.children) !== null && _a !== void 0 ? _a : [];
        obj.attributes = (_b = obj.attributes) !== null && _b !== void 0 ? _b : {};
        const originalHref = obj.attributes.href;
        const originalSrc = obj.attributes.src;
        obj.innerText = (_c = obj.innerText) !== null && _c !== void 0 ? _c : "";
        const a = await new Promise((resolve, reject) => {
            try {
                if (obj.tag.toLowerCase() === 'link' && obj.attributes.rel === 'stylesheet' && addSheet) {
                    const src = obj.attributes.href;
                    const url = new URL(src, relativePath);
                    $.ajax({
                        url: url.href,
                        type: 'get',
                        crossDomain: true,
                        processData: false,
                        success: (data2) => {
                            const saasConfig = window.saasConfig;
                            saasConfig.api.uploadFile(glitter.getUUID() + ".css").then((data) => {
                                const data1 = data.response;
                                $.ajax({
                                    url: data1.url,
                                    type: 'put',
                                    data: data2,
                                    headers: {
                                        "Content-Type": data1.type
                                    },
                                    processData: false,
                                    crossDomain: true,
                                    success: () => {
                                        obj.attributes.href = data1.fullUrl;
                                        resolve(true);
                                    },
                                    error: () => {
                                        resolve(true);
                                    },
                                });
                            });
                        },
                        error: (err) => {
                            resolve(true);
                        },
                    });
                }
                else if (obj.tag.toLowerCase() === 'script' && obj.attributes.src && addScript) {
                    const src = obj.attributes.src;
                    const url = new URL(src, relativePath);
                    alert(url.href);
                    $.ajax({
                        url: url.href,
                        processData: false,
                        type: 'get',
                        crossDomain: true,
                        success: (data2) => {
                            const saasConfig = window.saasConfig;
                            saasConfig.api.uploadFile(glitter.getUUID() + ".js").then((data) => {
                                const data1 = data.response;
                                $.ajax({
                                    url: data1.url,
                                    type: 'put',
                                    data: data2,
                                    headers: {
                                        "Content-Type": data1.type
                                    },
                                    processData: false,
                                    crossDomain: true,
                                    success: () => {
                                        alert('data1.fullUrl');
                                        obj.attributes.src = data1.fullUrl;
                                        resolve(true);
                                    },
                                    error: (jqXHR, textStatus, errorThrown) => {
                                        alert(errorThrown);
                                        resolve(true);
                                    },
                                });
                            });
                        },
                        error: (err) => {
                            resolve(true);
                            console.log(err);
                        },
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
        if (obj.textIndex === 0 && (obj.innerText.replace(/ /g, '').replace(/\n/g, '').length > 0 && (((_d = obj.children) !== null && _d !== void 0 ? _d : []).length > 0))) {
            setting.push(await convert({
                tag: 'span',
                innerText: obj.innerText
            }));
        }
        if (obj.children.length > 0) {
            obj.innerText = '';
        }
        for (const dd of ((_e = obj.children) !== null && _e !== void 0 ? _e : [])) {
            const data = await convert(dd);
            if (data.data.elem !== 'meta') {
                if (data.data.elem === 'style' || (data.data.elem === 'link' && (obj.attributes.rel === 'stylesheet'))) {
                    if ((data.data.elem === 'link' && (obj.attributes.rel === 'stylesheet'))) {
                        data.data.note = "源代碼路徑:" + originalHref;
                    }
                    if (addSheet) {
                        styleSheet.data.setting.push(data);
                    }
                }
                else if (data.data.elem === 'script') {
                    if ((obj.attributes.src)) {
                        data.data.note = "源代碼路徑:" + originalSrc;
                    }
                    if (addScript) {
                        jsLink.data.setting.push(data);
                    }
                }
                else {
                    if (addHtml) {
                        setting.push(data);
                    }
                }
            }
        }
        if (obj.textIndex > 0 && (obj.innerText.replace(/ /g, '').replace(/\n/g, '').length > 0 && (((_f = obj.children) !== null && _f !== void 0 ? _f : []).length > 0))) {
            setting.push(await convert({
                tag: 'span',
                innerText: obj.innerText
            }));
        }
        let x = {
            "id": glitter.getUUID(),
            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
            "css": { "class": {}, "style": {} },
            "data": {
                "class": (_g = obj.attributes.class) !== null && _g !== void 0 ? _g : "",
                "style": ((_h = obj.attributes.style) !== null && _h !== void 0 ? _h : ""),
                "attr": Object.keys(obj.attributes).filter((key) => {
                    return key !== 'class' && key !== 'style' && key !== 'id';
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
                "inner": (_j = obj.innerText) !== null && _j !== void 0 ? _j : "",
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
            x.data.inner = ((_k = x.data.attr.find((dd) => {
                return dd.attr === 'src';
            })) !== null && _k !== void 0 ? _k : { value: "" }).value;
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
    for (const dd of json.children) {
        if ((dd.tag.toLowerCase() !== 'title')) {
            dd.attributes = (_a = dd.attributes) !== null && _a !== void 0 ? _a : {};
            const originalHref = dd.attributes.href;
            const originalSrc = dd.attributes.src;
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
                else {
                    if (addHtml) {
                        waitPush.push(obj);
                    }
                }
            }
        }
    }
    if (styleSheet.data.setting.length > 0) {
        styleSheet.data.setting.map((dd) => {
            gvc.getBundle().callback(dd);
        });
    }
    if (jsLink.data.setting.length > 0) {
        gvc.getBundle().callback(jsLink);
    }
    waitPush.map((obj) => {
        gvc.getBundle().callback(obj);
    });
    setTimeout((() => {
        dialog.dataLoading({ visible: false });
        glitter.closeDiaLog();
    }), 1000);
}
function empty(gvc) {
    const glitter = gvc.glitter;
    return `<div class="m-auto bg-white shadow rounded  " style="max-width: 100%;max-height: 100%;">
  <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4 " >選擇元件添加方式</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
        glitter.closeDiaLog();
    })}"></i>
</div>    
<!-- Your code -->
</div>`;
}
