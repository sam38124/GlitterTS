import {GVC, init} from '../glitterBundle/GVController.js';
import {ApiPageConfig} from "../api/pageConfig.js";
import {ShareDialog} from "./ShareDialog.js";
import {BaseApi} from "../api/base.js";
import {config} from "../config.js";

init((gvc, glitter, gBundle) => {
    function getSource(dd: any) {
        return dd.src.official;
    }

    let configText = ''
    const textID = glitter.getUUID()

    function trigger() {
        const dialog = new ShareDialog(glitter)
        if (!configText) {
            dialog.errorMessage({text: "請輸入描述語句"})
            return
        }
        glitter.openDiaLog('dialog/ai-progress.js', 'ai-progress', {})
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
            glitter.closeDiaLog('ai-progress')
            if (re.result) {
                const html = document.createElement('body');
                console.log(`responseData:`+re.response.data)
                html.innerHTML = re.response.data;
                saveHTML(traverseHTML(html), '', gvc);
            } else {
                dialog.errorMessage({text: "轉換失敗，請輸入其他文案"})
            }
        })
    }

    // function linstener(event: any) {
    //     // 检查按下的键是否是"Enter"键
    //     if (event.keyCode === 13) {
    //         // 触发按钮的点击事件
    //         trigger();
    //     }
    // }
    return {
        onCreateView: () => {
            let viewModel: {
                loading: boolean,
                selectSource?: string,
                pluginList: { name: string, src: { official: string, open: boolean }, route: string }[]
            } = {
                loading: true,
                pluginList: []
            };
            gvc.addMtScript([
                {src: `https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js`}
            ], () => {
            }, () => {
            })

            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(10,10,10,0.7);" onclick="${gvc.event(() => {
                gvc.closeDialog()
            })}">
    <lottie-player src="https://assets4.lottiefiles.com/private_files/lf30_qfbae4sb.json"    speed="1"   style="max-width: 100%;width: 500px;height:100vh;transform: translateY(-100px)"  loop  autoplay></lottie-player>
    <div class="position-absolute translate-middle-x translate-middle-y d-flex flex-column align-items-center justify-content-center" style="top:calc(50% + 100px);width:350px;" onclick="${gvc.event((e, event) => {
                event.stopPropagation()
            })}" >
    ${gvc.bindView(() => {
                return {
                    bind: textID,
                    view: () => {
                        return glitter.htmlGenerate.editeText({
                            gvc: gvc,
                            title: '',
                            default: configText ?? "",
                            placeHolder: `輸入或說出AI生成語句\n譬如:
        -產生一個h1，字體顏色為紅色，大小為30px．
        -產生一個商品內文．
        -使用bootstrap生成一個商品展示頁面．
        `,
                            callback: (text: string) => {
                                configText = text
                            }
                        })
                    },
                    divCreate: {class:`w-100`}
                }
            })}
<div class="d-flex w-100 mt-2">
<div class="flex-fill"></div>
<button class="btn btn-warning" onclick="${gvc.event(() => {
                trigger()
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
            // @ts-ignore
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'zh-tw';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = function (event: any) {
                const transcript = event.results[0][0].transcript;
                configText += transcript
                gvc.notifyDataChange(textID)
                setTimeout(()=>{
                    recognition.start();
                },500)
            };
            recognition.start();

            // document.addEventListener('keydown', linstener, false);

        },
        onDestroy: () => {
            // document.removeEventListener('keydown', linstener, false)
        }
    };
});
// 遞迴函式，用於遍歷 HTML 內容
function traverseHTML(element: any) {
    var result: any = {};

    // 取得元素的標籤名稱
    result.tag = element.tagName;
    // 取得元素的屬性
    var attributes = element.attributes ?? [];
    if (attributes.length > 0) {
        result.attributes = {};
        for (let i = 0; i < attributes.length; i++) {
            result.attributes[attributes[i].name] = attributes[i].value;
        }
    }
    if(element.children && element.children.length>0){
        result.children=[]
        var childNodes = element.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                result.children.push(traverseHTML(node));
            } else if (node.nodeType === Node.TEXT_NODE) {
                const html = document.createElement('span');
                html.innerHTML = node.textContent.trim();
                if(html.innerHTML){
                    result.children.push(traverseHTML(html));
                }

            }else{
                if(node.tagName){  result.children.push(traverseHTML(node));}

            }
        }
    }


    // let trimmedStr = element.innerHTML.replace(/\n/,'').replace(/^\s+|\s+$/g, "");
    // let trimmedStr2 = element.innerText.replace(/\n/,'').replace(/^\s+|\s+$/g, "");
    // result.textIndex=trimmedStr.indexOf(trimmedStr2)
    result.innerText=(element.innerText ?? "").replace(/\n/,'').replace(/^\s+|\s+$/g, "")
    // 返回 JSON 結果
    return result;
}

async function saveHTML(json: any, relativePath: string, gvc: GVC, elem?: {
    elem: string,
    title: string,
    check: boolean
}[]) {
    const dialog = new ShareDialog(gvc.glitter)
    dialog.dataLoading({visible: true, text: "解析資源中"})
    const glitter = gvc.glitter
    let addSheet = elem?.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'style' && dd.check)
    }) || (elem === undefined)
    let addHtml = elem?.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'html' && dd.check)
    }) || (elem === undefined)
    let addScript = elem?.find((dd) => {
        return (dd.elem === 'all' && dd.check) || (dd.elem === 'script' && dd.check)
    }) || (elem === undefined)
    const styleSheet: any = {
        "id": glitter.getUUID(),
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {"class": {}, "style": {}},
        "data": {
            "elem": "glitterStyle",
            "dataFrom": "static",
            "atrExpand": {"expand": false},
            "elemExpand": {"expand": true},
            "innerEvenet": {},
            "setting": []
        },
        "type": "container",
        "label": "所有設計樣式",
    }
    const jsLink: any = {
        "id": glitter.getUUID(),
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {"class": {}, "style": {}},
        "data": {
            "elem": "glitterJS",
            "dataFrom": "static",
            "atrExpand": {"expand": false},
            "elemExpand": {"expand": true},
            "innerEvenet": {},
            "setting": []
        },
        "type": "container",
        "label": "所有JS資源",
    }

    async function covertHtml(json: any, pushArray: any[]) {
        for (const dd of json.children ?? []) {
            if ((dd.tag.toLowerCase() !== 'title')) {
                dd.attributes = dd.attributes ?? {}
                let originalHref='';
                let originalSrc='';
                try {
                    originalHref=new URL(dd.attributes.href, relativePath).href
                }catch (e) {

                }
                try {
                    originalSrc=new URL(dd.attributes.src, relativePath).href
                }catch (e) {

                }
                const obj = await convert(dd)
                if (obj.data.elem !== 'meta' && !(((obj.data.elem === 'link') && (dd.attributes.rel !== 'stylesheet')))) {
                    if (obj.data.elem === 'style' || ((obj.data.elem === 'link') && (dd.attributes.rel === 'stylesheet'))) {
                        if ((obj.data.elem === 'link' && (dd.attributes.rel === 'stylesheet'))) {
                            obj.data.note = "源代碼路徑:" + originalHref
                        }
                        if (addSheet) {
                            styleSheet.data.setting.push(obj)
                        }
                    } else if (obj.data.elem === 'script') {
                        if (addScript) {
                            obj.data.note = "源代碼路徑:" + originalSrc
                            jsLink.data.setting.push(obj)
                        }
                    } else {
                        if (addHtml) {
                            pushArray.push(obj)
                        }
                    }
                }
            }
        }
    }

    async function convert(obj: any) {
        obj.children = obj.children ?? []
        obj.attributes = obj.attributes ?? {}
        let originalHref = obj.attributes.href
        let originalSrc = obj.attributes.src
        obj.innerText = obj.innerText ?? ""
        const a = await new Promise((resolve, reject) => {
            try {
                if (obj.tag.toLowerCase() === 'link' && obj.attributes.rel === 'stylesheet' && addSheet) {
                    const src = obj.attributes.href
                    const url = new URL(src, relativePath)
                    originalHref = url.href
                    getFile(url.href).then((link)=>{
                        obj.attributes.href=link
                        resolve(true)
                    })
                } else if (obj.tag.toLowerCase() === 'script' && obj.attributes.src && addScript) {
                    const src = obj.attributes.src
                    const url = new URL(src, relativePath)
                    originalSrc = url
                    getFile(url.href).then((link)=>{
                        obj.attributes.src=link
                        resolve(true)
                    })
                } else if(obj.tag.toLowerCase() === 'img' && obj.attributes.src && addHtml){
                    const src = obj.attributes.src
                    const url = new URL(src, relativePath)
                    fetch(url.href)
                        .then(response => response.blob())
                        .then(blob => {
                            const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                            saasConfig.api.uploadFile(
                                glitter.getUUID() +"." +url.href.split('.').pop()
                            ).then((data: any) => {
                                const data1 = data.response;
                                $.ajax({
                                    url: data1.url,
                                    type: 'put',
                                    data: blob,
                                    headers: {
                                        "Content-Type": data1.type
                                    },
                                    processData: false,
                                    crossDomain: true,
                                    success: () => {
                                        obj.attributes.src=data1.fullUrl
                                        resolve(true)
                                    },
                                    error: () => {
                                        resolve(false)
                                    },
                                });
                            });
                        })
                        .catch(error => {
                            console.error('下載檔案失敗:', error);
                            resolve(false)

                        });
                }else{
                    resolve(true)
                }
            } catch (e) {
                resolve(true)
            }

        })
        let setting: any = []
        // if (obj.textIndex === 0 && (obj.innerText.replace(/ /g, '').replace(/\n/g, '').length > 0 && ((obj.children ?? []).length > 0))) {
        //     setting.push(await convert({
        //         tag: 'span',
        //         innerText: obj.innerText
        //     }))
        // }
        // if (obj.children.length > 0) {
        //     obj.innerText = ''
        // }
        await covertHtml(obj,setting);
        // if (obj.textIndex > 0 && (obj.innerText.replace(/ /g, '').replace(/\n/g, '').length > 0 && ((obj.children ?? []).length > 0))) {
        //     setting.push(await convert({
        //         tag: 'span',
        //         innerText: obj.innerText
        //     }))
        // }
        let x = {
            "id": glitter.getUUID(),
            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
            "css": {"class": {}, "style": {}},
            "data": {
                "class": obj.attributes.class ?? "",
                "style": (obj.attributes.style ?? ""),
                "attr": Object.keys(obj.attributes).filter((key) => {
                    return key !== 'class' && key !== 'style'
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
                "atrExpand": {"expand": true},
                "elemExpand": {"expand": true},
                "innerEvenet": {},
                "setting": setting
            },
            "type": (obj.children && obj.children.length > 0) ? "container" : "widget",
            "label": (() => {
                if (obj.tag.toLowerCase() === 'link' && (obj.attributes.rel === 'stylesheet')) {
                    return `style資源`
                }
                const source = ['script', 'style'].indexOf(obj.tag.toLowerCase())
                if (source >= 0) {
                    return ['script資源', 'style資源'][source]
                }
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
            })(),
            "styleList": []
        }
        if (x.data.style.length > 0) {
            x.data.style += ";"
        }
        if (x.data.elem === 'img') {
            x.data.inner = (x.data.attr.find((dd) => {
                return dd.attr === 'src'
            }) ?? {value: ""}).value
            x.data.attr = x.data.attr.filter((dd) => {
                return dd.attr !== 'src'
            })
        }
        if ((x.data.elem === 'html') || (x.data.elem === 'head')) {
            x.data.elem = 'div'
        }
        return new Promise<any>((resolve, reject) => {
            resolve(x)
        })
    }

    let waitPush: any = []

    await covertHtml(json, waitPush)
    if (styleSheet.data.setting.length > 0) {
        styleSheet.data.setting.map((dd: any) => {
            gvc.getBundle().callback(dd);
        })
    }
    if (jsLink.data.setting.length > 0) {
        jsLink.data.setting.map((dd: any) => {
            gvc.getBundle().callback(dd);
        })
    }

    waitPush.map((obj: any) => {
        gvc.getBundle().callback(obj);
    })
    setTimeout((() => {
        dialog.dataLoading({visible: false})
        glitter.closeDiaLog()
    }), 1000)

}
function getFile(href:string){
    const glitter=(window as any).glitter
    return new Promise<string>((resolve, reject)=>{
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
                const saasConfig: { config: any; api: any } = (window as any).saasConfig;
                saasConfig.api.uploadFile(
                    glitter.getUUID() +"." +href.split('.').pop()
                ).then((data: any) => {
                    const data1 = data.response;
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: data2.data,
                        headers: {
                            "Content-Type": data1.type
                        },
                        processData: false,
                        crossDomain: true,
                        success: () => {
                            resolve(data1.fullUrl)
                        },
                        error: () => {
                            resolve(href)
                        },
                    });
                });
            },
            error: (err) => {
                resolve(href)
            },
        });
    })

}