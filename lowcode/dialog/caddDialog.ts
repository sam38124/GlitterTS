import {init, GVC} from '../glitterBundle/GVController.js';
import {ApiPageConfig} from "../api/pageConfig.js";
import {BaseApi} from "../api/base.js";
import {config} from "../config.js";
import {ShareDialog} from "../dialog/ShareDialog.js";

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            let progress = 0
            const style = {
                style1: `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;`,
                style2: `background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;`
            }
            return gvc.bindView(() => {
                const id = glitter.getUUID()
                return {
                    bind: id,
                    view: () => {
                        if (progress === 0) {
                            return `<div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;">
  <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4 " >選擇元件添加方式</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                                glitter.closeDiaLog();
                            })}"></i>
</div>    
<div class="row m-2">
<div class="border-0 text-center col-12 col-sm-4 bg-none d-flex flex-column align-items-center justify-content-center" onclick="${gvc.event(() => {
                                progress = 1
                                gvc.notifyDataChange(id)
                            })}">
<div class="rounded-circle d-flex align-items-center justify-content-center" style="height: 100px;width: 100px; background:whitesmoke;">
<i class="fa-solid fa-puzzle-piece-simple   fs-2" style="${style.style1}"></i>
</div>
  <h5 class="fw-medium fs-lg mb-1  mt-2" style="${style.style1}">頁面模塊</h5>
</div>
<div class="border-0 text-center col-12 col-sm-4 bg-none d-flex flex-column align-items-center justify-content-center"  onclick="${gvc.event(() => {
                                progress = 2
                                gvc.notifyDataChange(id)
                            })}">
<div class="rounded-circle d-flex align-items-center justify-content-center" style="height: 100px;width: 100px; background:whitesmoke;">
<i class="fa-solid fa-code   fs-2" style="${style.style2}"></i>
</div>
  <h5 class="fw-medium fs-lg mb-1  mt-2" style="${style.style2}">程式碼</h5>
</div>
<div class="border-0 text-center col-12 col-sm-4 bg-none d-flex flex-column align-items-center justify-content-center" onclick="${gvc.event(() => {
                                progress = 3
                                gvc.notifyDataChange(id)
                            })}">
<div class="rounded-circle d-flex align-items-center justify-content-center" style="height: 100px;width: 100px; background:whitesmoke;">
<i class="fa-light fa-microchip-ai   fs-2 text-gradient-primary" ></i>
</div>
  <h5 class="fw-medium fs-lg mb-1  mt-2 text-gradient-primary" >AI生成</h5>
</div>
</div>
</div>`
                        } else if (progress === 1) {
                            return cAdd(gvc)
                        } else if (progress === 2) {
                            return codeEditor(gvc)
                        } else if (progress === 3) {
                            return aiEditor(gvc)
                        } else {
                            return ``
                        }
                    },
                    divCreate: {
                        class: `w-100 h-100 d-flex flex-column align-items-center justify-content-center`,
                        style: "background-color: rgba(0,0,0,0.5);"
                    }
                }
            })
        }
    };
});

function cAdd(gvc: GVC) {
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

    function getSource(dd: any) {
        return dd.src.official;
    }

    let viewModel: {
        loading: boolean,
        selectSource?: string,
        pluginList: { name: string, src: { official: string, open: boolean }, route: string }[]
    } = {
        loading: true,
        pluginList: []
    };

    async function loading() {
        viewModel.loading = true
        const data = await ApiPageConfig.getPlugin(gvc.getBundle().appName)
        if (data.result) {
            viewModel.loading = false
            viewModel.pluginList = data.response.data.pagePlugin;
            gvc.notifyDataChange([tabID, docID])
        }
    }

    loading()
    const glitter = gvc.glitter
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
                return ``
            }
            return gvc.map(viewModel.pluginList.map((dd, index) => {
                viewModel.selectSource = viewModel.selectSource ?? getSource(dd);
                return `
                 <li class="nav-item">
    <a class="nav-link ${(viewModel.selectSource === getSource(dd)) ? `active` : ``}" onclick="${gvc.event(() => {
                    viewModel.selectSource = getSource(dd);
                    gvc.notifyDataChange([docID, tabID]);
                })}">${dd.name}</a>
  </li>
                `;
            }))
        },
        divCreate: {class: `nav nav-tabs border-bottom px-2 pt-2`}
    })}
<div class="container w-100 pt-2 overflow-scroll" style="height: calc(100% - 180px);">
${gvc.bindView({
        bind: docID,
        view: () => {
            function tryReturn(fun: () => string, defaults: string): string {
                try {
                    return fun();
                } catch (e) {
                    return defaults;
                }
            }

            if (!viewModel.selectSource) {
                return ``
            }
            const obg = glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource!)];
            if (!obg) {
                return ``
            }

            return gvc.map(Object.keys(glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource!)]).filter((dd) => {
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
">${
                    tryReturn(() => {
                        return obg[dd].subContent;
                    }, '')
                }</p>
    <a onclick="${gvc.event(() => {
                    const ob = JSON.parse(JSON.stringify(obg))
                    gvc.getBundle().callback({
                        'id': glitter.getUUID(),
                        'data': ob[dd].defaultData ?? {},
                        'style': ob[dd].style,
                        'class': ob[dd].class,
                        'type': dd,
                        'label': tryReturn(() => {
                            return ob[dd].title;
                        }, dd),
                        'js': viewModel.selectSource
                    });
                    glitter.closeDiaLog()
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
                if (!glitter.share.htmlExtension[glitter.htmlGenerate.resourceHook(viewModel.selectSource!)]) {
                    glitter.addMtScript([
                        {src: glitter.htmlGenerate.resourceHook(viewModel.selectSource!), type: 'module'}
                    ], () => {
                        gvc.notifyDataChange(docID);
                    }, () => {
                    });
                }
            }

        }
    })}
</div>

</div>`
}

function codeEditor(gvc: GVC) {
    const glitter = gvc.glitter
    let code = ''
    return `<div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;width:480px;">
  <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4" >請輸入HTML代碼</h3>
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
        placeHolder: `請輸入HTML代碼`,
        callback: (text: string) => {
            code = text
        }
    })}
</div>
<div class="d-flex p-2 align-content-end justify-content-end">
<button class="btn btn-warning text-dark " onclick="${gvc.event(() => {
        const html = document.createElement('body');
        html.innerHTML = code;
        saveHTML(traverseHTML(html), gvc);
    })}"><i class="fa-regular fa-floppy-disk me-2"></i> 儲存</button>
</div>
</div>`
}

function aiEditor(gvc: GVC) {
    const glitter = gvc.glitter
    let code = ''
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
        callback: (text: string) => {
            code = text
        }
    })}
</div>
<div class="d-flex p-2 align-content-end justify-content-end">
<button class="btn btn-warning text-dark " onclick="${gvc.event(() => {
        const dialog = new ShareDialog(glitter)
        if(!code){
            dialog.errorMessage({text:"請輸入描述語句"})
            return
        }
    glitter.openDiaLog('dialog/ai-progress.js','ai-progress',{})
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
            glitter.closeDiaLog('ai-progress')
            if (re.result) {
                const html = document.createElement('body');
                html.innerHTML = re.response.data;
                saveHTML(traverseHTML(html), gvc);
            } else {
                dialog.errorMessage({text: "轉換失敗，請輸入其他文案"})
            }
        })
    })}"><i class="fa-regular fa-floppy-disk me-2"></i> 儲存</button>
</div>
</div>`
}

// 遞迴函式，用於遍歷 HTML 內容
function traverseHTML(element: any) {
    var result: any = {};

    // 取得元素的標籤名稱
    result.tag = element.tagName;

    // 取得元素的屬性
    var attributes = element.attributes;
    if (attributes.length > 0) {
        result.attributes = {};
        for (var i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }

    // 取得元素的子元素
    var children = element.children;
    if (children.length > 0) {
        result.children = [];
        for (var j = 0; j < children.length; j++) {
            result.children.push(traverseHTML(children[j]));
        }
    } else {
        result.innerText = element.innerHTML
    }

    // 返回 JSON 結果
    return result;
}

function saveHTML(json: any, gvc: GVC) {
    const glitter = gvc.glitter

    function convert(obj: any) {
        obj.attributes = obj.attributes ?? {}
        const x = {
            "id": glitter.getUUID(),
            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
            "css": {"class": {}, "style": {}},
            "data": {
                "class": obj.attributes.class ?? "",
                "style": (obj.attributes.style ?? "")+";",
                "attr": Object.keys(obj.attributes).filter((key) => {
                    return key !== 'class' && key !== 'style' && key !== 'id'
                }).map((dd) => {
                    const of = obj.attributes[dd]
                    return {
                        "attr": dd,
                        "type": "par",
                        "value": of,
                        "expand": false,
                    }
                }),
                "elem": obj.tag.toLowerCase(),
                "inner": obj.innerText ?? "",
                "dataFrom": "static",
                "atrExpand": {"expand": false},
                "elemExpand": {"expand": true},
                "innerEvenet": {},
                "setting": (obj.children ?? []).map((dd: any) => {
                    return convert(dd)
                })
            },
            "type": (obj.children && obj.children.length > 0) ? "container" : "widget",
            "label": (() => {
                const la = (() => {
                    let lab = obj.innerText ?? ((obj.type === 'container') ? `HTML容器` : `HTML元件`)
                    lab = lab.trim().replace(/&nbsp;/g, '')
                    if (lab.length > 10) {
                        return lab.substring(0, 10)
                    } else {
                        if (lab.length === 0) {
                            return ((obj.type === 'container') ? `HTML容器` : `HTML元件`)
                        } else {
                            return lab
                        }
                    }
                })()
                return la
            })(),
            "styleList": []
        }
        if (x.data.elem === 'img') {
            x.data.inner = (x.data.attr.find((dd) => {
                return dd.attr === 'src'
            }) ?? {value:""}).value
            x.data.attr=x.data.attr.filter((dd)=>{
                return dd.attr!=='src'
            })
        }

        if ((x.data.elem === 'html') || (x.data.elem === 'head')) {
            x.data.elem='div'
        }
        if ((x.data.elem === 'style') ) {
            x.label='設計區塊'
        }
        return x
    }

    json.children.map((dd: any) => {
        if ((dd.tag.toLowerCase() !== 'title')) {
            const obj = convert(dd)
            gvc.getBundle().callback(obj);
        }
    })

    glitter.closeDiaLog()
}

function empty(gvc: GVC) {

    const glitter = gvc.glitter

    return `<div class="m-auto bg-white shadow rounded" style="max-width: 100%;max-height: 100%;">
  <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4 " >選擇元件添加方式</h3>
        <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
        glitter.closeDiaLog();
    })}"></i>
</div>    
<!-- Your code -->
</div>`
}