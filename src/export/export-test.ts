// import * as fs from "fs";
// import axios from "axios";
// import path from "path";
//
//
// let linkHistory: {href:string,local:string}[] = []
//
// async function downloadFile(url: string, localPath: string) {
//     let response = (await axios.get(url, {responseType: 'text'})).data;
//     if (!linkHistory.find((dd)=>{return dd.href===url})) {
//         linkHistory.push({
//             href:url,
//             local:getUUID() + getFileExtension(url)
//         })
//     }
//     const local=linkHistory.find((dd)=>{return dd.href===url})!.local
//     let convert=response.split('\n')
//     for (let a=0;a<convert.length;a++){
//         const b = convert[a]
//         if(b.includes('import')&&b.includes(' from ')&&(b.charAt(b.length - 1)===';')){
//             const path=b.substring(b.indexOf(' from ')+6,b.indexOf(';')).replace(/"/g,'').replace(/'/g,'')
//             const newPath=await downloadFile(new URL(path,url).href,localPath)
//             convert[a]=b.substring(0,b.lastIndexOf(' from '))+` from "./${newPath}"`
//         }
//     }
//
//     fs.writeFileSync(localPath + '/' +local, convert.join('\n'), 'utf8');
//     return local
// }
//
//
// async function checkStart() {
//     // const response = await axios.get('https://raw.githubusercontent.com/sam38124/One-page-plugin/main/src/one-page-blue/style-1/contact.js', { responseType: 'text' });
//     // console.log(response.data)
//     clearFolder('/Users/jianzhi.wang/Desktop/test_store')
//     const path=await downloadFile('https://raw.githubusercontent.com/sam38124/One-page-plugin/main/src/one-page-blue/style-1/contact.js', '/Users/jianzhi.wang/Desktop/test_store')
//     console.log(path)
// }
//
// function clearFolder(folderPath: string) {
//     if (fs.existsSync(folderPath)) {
//         fs.readdirSync(folderPath).forEach((file) => {
//             const filePath = path.join(folderPath, file);
//
//             if (fs.statSync(filePath).isDirectory()) {
//                 clearFolder(filePath); // 递归清空子文件夹
//                 fs.rmdirSync(filePath); // 删除子文件夹
//             } else {
//                 fs.unlinkSync(filePath); // 删除文件
//             }
//         });
//     }
// }
//
// function getFileExtension(filename: string) {
//     try {
//         // 使用正则表达式获取副檔名部分
//         const regex = /(?:\.([^.]+))?$/;
//         const extension = regex.exec(filename)![1];
//         return (extension ? "." + extension.toLowerCase() : '');
//     } catch (e) {
//         return ``
//     }
//
// }
//
// function getUUID(): string {
//     let d = Date.now();
//
//     if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
//         d += performance.now(); //use high-precision timer if available
//     }
//
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         let r = (d + Math.random() * 16) % 16 | 0;
//         d = Math.floor(d / 16);
//         return "s" + (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
//     });
// }
//
// checkStart()

const a=[
    {
        "id": "s4ses0s7s1s7s5s4-s7s5scsc-4s7sese-sbsas3sa-s7s0sbs6s3s3s0s0sbs6s8s8",
        "js": "$style1/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "tag": "header",
            "list": [
                {
                    "tag": "標頭未登入",
                    "code": "(()=>{\nreturn GlobalUser.token\n})()",
                    "name": "是否登入",
                    "evenet": {},
                    "expand": true,
                    "carryData": {}
                }
            ],
            "expand": true,
            "carryData": {}
        },
        "type": "component",
        "index": 0,
        "label": "嵌入模塊",
        "style": "height:0px;z-index:999;",
        "hashTag": "",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s1s2sds2s8s2sds2-s3s8s3sa-4s0s0s8-s9sdsds8-s7sas6s5ses9s8sascsbs9sc",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [],
            "elem": "section",
            "class": "position-relative d-flex align-items-center min-vh-100 py-5 bg-dark overflow-hidden",
            "inner": "Top software engineering company\n                \n                  We are the Top Rated agency on\n                  \n                \n                Start your project\n              \n            \n            \n              \n                \n                  \n                    \n                  \n                \n                \n                  \n                    \n                      \n                        \n                          I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts\n                        \n                      \n                    \n                  \n                  \n                    \n                      \n                        \n                          I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
            "style": "background: 50%/cover url(https://liondesign-prd.s3.amazonaws.com/file/guest/1685899008679-1.jpg);\nbackground-color: rgba(0, 0, 0, 0.9); ",
            "setting": [
                {
                    "id": "sbs7s1scs6s5s6sf-s5s4s9s9-4s2sds4-s8s2sasc-s3s5sfs3s9scs7scs4s2s7s5",
                    "js": "$style1/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "div",
                        "class": " position-absolute ",
                        "inner": "",
                        "style": "width:100%;height:100%;top:0px;left:0px; background-color: rgba(0, 0, 0, 0.3); ",
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": false
                        },
                        "styleList": [],
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "widget",
                    "index": 0,
                    "label": "HTML元件",
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "s3sfs5sescs0s0s8-sasfs6se-4scses1-s8s3s7s3-sdsfses9s8s7ses9s1s1s6sf",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "span",
                        "class": "position-absolute top-0 start-0 d-dark-mode-block d-none w-100 h-100 bg-secondary opacity-75",
                        "inner": "",
                        "style": "",
                        "setting": [],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "widget",
                    "index": 1,
                    "label": "HTML元件",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "s4sds7s0s3sfs4s8-s2sfs2se-4scsesf-sas8sfs0-s2sfs8s6sds5s1s7s0s0sasa",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "div",
                        "class": "container position-relative dark-mode mt-5 mb-lg-5 mb-md-4 mb-3 pt-3 pb-xl-3",
                        "inner": "Top software engineering company\n                \n                  We are the Top Rated agency on\n                  \n                \n                Start your project\n              \n            \n            \n              \n                \n                  \n                    \n                  \n                \n                \n                  \n                    \n                      \n                        \n                          I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts\n                        \n                      \n                    \n                  \n                  \n                    \n                      \n                        \n                          I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
                        "style": "",
                        "setting": [
                            {
                                "id": "ses9s4s7s5s2sas6-s1sas2s8-4s9s2sc-s8sbs7s1-sfs0s8s1s9s5sfs4s8sfs2s7",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [],
                                    "elem": "div",
                                    "class": "row gy-5",
                                    "inner": "Top software engineering company\n                \n                  We are the Top Rated agency on\n                  \n                \n                Start your project\n              \n            \n            \n              \n                \n                  \n                    \n                  \n                \n                \n                  \n                    \n                      \n                        \n                          I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts\n                        \n                      \n                    \n                  \n                  \n                    \n                      \n                        \n                          I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
                                    "style": "",
                                    "setting": [
                                        {
                                            "id": "sases2s8s8s1s9s4-s5s0s8s9-4sbs9s0-sas3s0s4-s9s3sdsas9s1ses1s0ses2s5",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "col-xl-5 col-lg-6",
                                                "inner": "Top software engineering company\n                \n                  We are the Top Rated agency on\n                  \n                \n                Start your project",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "sbs9s5s4s7s7sdsa-s3s1s7s1-4s4s5s1-sasbsbsc-sdsbs2sfs5sfs8s4s5ses9s6",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "div",
                                                            "class": "position-relative zindex-5 text-lg-start text-center",
                                                            "inner": "Top software engineering company\n                \n                  We are the Top Rated agency on\n                  \n                \n                Start your project",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s9sas4s6s6s6s3s3-sbs4s2s7-4ses5sd-s9s3s9sa-sasasases3s4s2scsfs0s7s5",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "h1",
                                                                        "class": "display-2 mb-4 pb-lg-3 pb-md-2",
                                                                        "inner": "Top software engineering company",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "s4s4s1ses2sas1sc-s4s7s0s4-4s1s2se-s9s3s5sb-s3sas2s2s6s4ses2s1s4s8s6",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [
                                                                                        {
                                                                                            "attr": "onclick",
                                                                                            "type": "event",
                                                                                            "expand": true,
                                                                                            "attrType": "normal",
                                                                                            "clickEvent": [
                                                                                                {
                                                                                                    "code": "console.log('test1')",
                                                                                                    "expand": true,
                                                                                                    "clickEvent": {
                                                                                                        "src": "official_event/event.js",
                                                                                                        "route": "code"
                                                                                                    },
                                                                                                    "blockExpand": {
                                                                                                        "expand": false
                                                                                                    },
                                                                                                    "pluginExpand": {
                                                                                                        "expand": true
                                                                                                    },
                                                                                                    "dataPlaceExpand": {
                                                                                                        "expand": false
                                                                                                    },
                                                                                                    "errorPlaceExpand": {
                                                                                                        "expand": false
                                                                                                    }
                                                                                                },
                                                                                                {
                                                                                                    "code": "console.log('test2')",
                                                                                                    "expand": true,
                                                                                                    "clickEvent": {
                                                                                                        "src": "official_event/event.js",
                                                                                                        "route": "code"
                                                                                                    },
                                                                                                    "blockExpand": {
                                                                                                        "expand": false
                                                                                                    },
                                                                                                    "pluginExpand": {
                                                                                                        "expand": true
                                                                                                    },
                                                                                                    "dataPlaceExpand": {
                                                                                                        "expand": false
                                                                                                    },
                                                                                                    "errorPlaceExpand": {
                                                                                                        "expand": false
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ],
                                                                                    "elem": "span",
                                                                                    "class": "",
                                                                                    "inner": "GLITTER.AI",
                                                                                    "style": "  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;",
                                                                                    "setting": [],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "styleList": [],
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "widget",
                                                                                "index": 0,
                                                                                "label": "software",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            },
                                                                            {
                                                                                "id": "s4s1s6sasescs7s8-scs5s6s2-4sdsfsc-sbs6s4s7-s1s1s5s7sdsesfsbses5s7s3",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "span",
                                                                                    "class": "",
                                                                                    "inner": "<br>AI 低代碼整合開發平台",
                                                                                    "style": "font-size:40px;color:white;",
                                                                                    "setting": [],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "styleList": [],
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "widget",
                                                                                "index": 1,
                                                                                "label": "engineerin",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Top softwa",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                },
                                                                {
                                                                    "id": "sdsescs0sfs1s7sc-sfses0s7-4sas5s0-sbs9sdsc-sas6s6s5s0s4s2s4sfses3s1",
                                                                    "js": "$style1/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "text-white fw-bold",
                                                                        "inner": "眾多應用模版與頁面編輯器，AI代碼生成、Serverless、Lambda Function、網域代管、SEO代管、SSL憑證代管、後台系統，Android / IOS / WEB 跨平台應用部署．<br><br>",
                                                                        "style": "font-size:24px;",
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": false
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 1,
                                                                    "label": "HTML元件",
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                },
                                                                {
                                                                    "id": "s2s6s4s4s1sfs0s2-s2s8s2s1-4s5sbs1-sbsds7sa-s7sds7sds5s1sbs2s9sbs0sf",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [
                                                                            {
                                                                                "attr": "onclick",
                                                                                "type": "event",
                                                                                "expand": true,
                                                                                "clickEvent": [
                                                                                    {
                                                                                        "link": "signin",
                                                                                        "expand": true,
                                                                                        "clickEvent": {
                                                                                            "src": "$style1/event.js",
                                                                                            "route": "link"
                                                                                        },
                                                                                        "pluginExpand": {
                                                                                            "expand": true
                                                                                        },
                                                                                        "stackControl": "home",
                                                                                        "dataPlaceExpand": {
                                                                                            "expand": false
                                                                                        },
                                                                                        "errorPlaceExpand": {
                                                                                            "expand": false
                                                                                        },
                                                                                        "link_change_type": "inlink"
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ],
                                                                        "elem": "a",
                                                                        "class": "btn btn-lg btn-primary",
                                                                        "inner": "立即開始",
                                                                        "style": "",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 2,
                                                                    "label": "Start your",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "Top softwa",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "Top softwa",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "sfscs3s9s0s1s0s0-s7s3sas7-4s7s7s9-s9s6sas0-s6sfs3s2s4s1s6s4s7sds8s3",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "col-lg-6 offset-xl-1",
                                                "inner": "I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts\n                        \n                      \n                    \n                  \n                  \n                    \n                      \n                        \n                          I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "scscs9sds7s7s4s1-s5s3s2s6-4s9sbs8-s8s5s5sd-s4scs0sds8s8s0sfs1s9s7s8",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "div",
                                                            "class": "position-relative ms-xl-0 ms-lg-4",
                                                            "inner": "I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts\n                        \n                      \n                    \n                  \n                  \n                    \n                      \n                        \n                          I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s5s2ses2s3sas0s0-sfsfs9s4-4scs7s2-sas8s6se-s8s8sfsds3s9s9s6sdsas3s4",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "position-absolute top-50 start-50 translate-middle ratio ratio-1x1",
                                                                        "inner": "",
                                                                        "style": "width: 125%; max-width: 49.75rem;;",
                                                                        "setting": [
                                                                            {
                                                                                "id": "sasbsfs8s7s5s6s7-s2s1sbs5-4s5s9s9-sases6s7-s6s4s7s3s8s5s6s5scs0sfsd",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "p-md-0 p-5",
                                                                                    "inner": "",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "s1scsfs8s0sbsds9-s3sesbs7-4sds5s4-sasfs3s4-sas1s5s6sds3s7scsbs3sds3",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Shape",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "img",
                                                                                                "class": "hero-animation-spin p-md-0 p-5",
                                                                                                "inner": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687190752893-168719075288285.82044595196719.png",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "HTML元件",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "HTML元件",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                },
                                                                {
                                                                    "id": "sasbs4sfs7s2s0s1-s6sbsds1-4scsas2-sbs3s9s2-s0s0s3s9s8s6s4sas8s1sasa",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "position-relative row row-cols-sm-2 row-cols-1 gx-xl-4 gx-lg-3 gx-md-4  gx-3",
                                                                        "inner": "I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts\n                        \n                      \n                    \n                  \n                  \n                    \n                      \n                        \n                          I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "sfs8sfs6s6s0sbsd-s6s6sbsc-4sasbsb-sas0s7sc-s3s8s1s9s2ses9ses3sbsdse",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "col",
                                                                                    "inner": "I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "s6sescsbsfs0s6sc-s1s1s8s2-4sdsdsf-sbs6s1sa-s8s1s1s1s4s3ses3s0s0sasb",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "div",
                                                                                                "class": "d-sm-grid d-flex gap-xl-4 gap-lg-3 gap-md-4 gap-sm-3 gap-2",
                                                                                                "inner": "I need AI engineers\n                        \n                      \n                      \n                        \n                          We are looking for Shopify Experts",
                                                                                                "style": "",
                                                                                                "setting": [
                                                                                                    {
                                                                                                        "id": "s5s5sds9scses6sd-s7sfs3sd-4sbs9s2-sbses0s3-s0s3sfs5s8s4sas9s4s8s3s2",
                                                                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                        "css": {
                                                                                                            "class": {},
                                                                                                            "style": {}
                                                                                                        },
                                                                                                        "data": {
                                                                                                            "attr": [],
                                                                                                            "elem": "div",
                                                                                                            "class": "d-flex align-items-center justify-content-center bg-secondary rounded-3 col-6 col-sm-12",
                                                                                                            "inner": "I need AI engineers",
                                                                                                            "style": "min-height: 176px;  backdrop-filter: blur(6px); -webkit-backdrop-filter:blur(6px);",
                                                                                                            "setting": [
                                                                                                                {
                                                                                                                    "id": "s9ses4sfs9s8s5s2-s3scs9se-4s9sas9-sbs6ses6-s2s2s2s6s5sbs6s2s5s3s4sf",
                                                                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                    "css": {
                                                                                                                        "class": {},
                                                                                                                        "style": {}
                                                                                                                    },
                                                                                                                    "data": {
                                                                                                                        "attr": [],
                                                                                                                        "elem": "div",
                                                                                                                        "class": "p-xl-4 p-sm-3 p-2 fs-xl fw-semibold text-center",
                                                                                                                        "inner": "I need AI engineers",
                                                                                                                        "style": "",
                                                                                                                        "setting": [
                                                                                                                            {
                                                                                                                                "id": "s0s1s0scs5sfs2s8-sfs7sfs2-4s7sasd-sas1sfs6-sfs7s4sbs1s1s9s9sas9sasf",
                                                                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                                "css": {
                                                                                                                                    "class": {},
                                                                                                                                    "style": {}
                                                                                                                                },
                                                                                                                                "data": {
                                                                                                                                    "attr": [],
                                                                                                                                    "elem": "span",
                                                                                                                                    "class": "hero-animation-fade text-white",
                                                                                                                                    "inner": "APP開發",
                                                                                                                                    "style": "",
                                                                                                                                    "setting": [],
                                                                                                                                    "dataFrom": "static",
                                                                                                                                    "atrExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "elemExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "innerEvenet": {}
                                                                                                                                },
                                                                                                                                "type": "widget",
                                                                                                                                "index": 0,
                                                                                                                                "label": "I need AI ",
                                                                                                                                "styleList": [],
                                                                                                                                "refreshAllParameter": {},
                                                                                                                                "refreshComponentParameter": {}
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "dataFrom": "static",
                                                                                                                        "atrExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "elemExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "innerEvenet": {}
                                                                                                                    },
                                                                                                                    "type": "container",
                                                                                                                    "index": 0,
                                                                                                                    "label": "I need AI ",
                                                                                                                    "styleList": [],
                                                                                                                    "refreshAllParameter": {},
                                                                                                                    "refreshComponentParameter": {}
                                                                                                                }
                                                                                                            ],
                                                                                                            "dataFrom": "static",
                                                                                                            "atrExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "styleList": [],
                                                                                                            "elemExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "innerEvenet": {}
                                                                                                        },
                                                                                                        "type": "container",
                                                                                                        "index": 0,
                                                                                                        "label": "I need AI ",
                                                                                                        "styleList": [],
                                                                                                        "refreshAllParameter": {},
                                                                                                        "refreshComponentParameter": {}
                                                                                                    },
                                                                                                    {
                                                                                                        "id": "scses6s8s6s1sbs9-s9s7s2s7-4s2s9se-sas2s4sb-s4s4scs3s9s3sds8s8s8s5sf",
                                                                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                        "css": {
                                                                                                            "class": {},
                                                                                                            "style": {}
                                                                                                        },
                                                                                                        "data": {
                                                                                                            "attr": [],
                                                                                                            "elem": "div",
                                                                                                            "class": "d-flex align-items-center justify-content-center bg-secondary rounded-3 col-6 col-sm-12",
                                                                                                            "inner": "We are looking for Shopify Experts",
                                                                                                            "style": "min-height: 176px; backdrop-filter: blur(6px); -webkit-backdrop-filter:blur(6px);",
                                                                                                            "setting": [
                                                                                                                {
                                                                                                                    "id": "s8s1s5sasasds7s9-sbs7s4s4-4sasas7-sbsfs0s6-sfsds8s9ses2s3sds2s8s8s9",
                                                                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                    "css": {
                                                                                                                        "class": {},
                                                                                                                        "style": {}
                                                                                                                    },
                                                                                                                    "data": {
                                                                                                                        "attr": [],
                                                                                                                        "elem": "div",
                                                                                                                        "note": "後台系統",
                                                                                                                        "class": "p-xl-4 p-sm-3 p-2 fs-xl fw-semibold text-center",
                                                                                                                        "inner": "We are looking for Shopify Experts",
                                                                                                                        "style": "",
                                                                                                                        "setting": [
                                                                                                                            {
                                                                                                                                "id": "sfs6s5s4sfs4scsb-s5s2s8sc-4s3s1sb-s8s3s5s2-s9s2scs5s3sbs5s8s6sas9s2",
                                                                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                                "css": {
                                                                                                                                    "class": {},
                                                                                                                                    "style": {}
                                                                                                                                },
                                                                                                                                "data": {
                                                                                                                                    "attr": [],
                                                                                                                                    "elem": "span",
                                                                                                                                    "class": "hero-animation-fade hero-animation-delay-2 text-white",
                                                                                                                                    "inner": "後台系統",
                                                                                                                                    "style": "",
                                                                                                                                    "setting": [],
                                                                                                                                    "dataFrom": "static",
                                                                                                                                    "atrExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "elemExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "innerEvenet": {}
                                                                                                                                },
                                                                                                                                "type": "widget",
                                                                                                                                "index": 0,
                                                                                                                                "label": "We are loo",
                                                                                                                                "styleList": [],
                                                                                                                                "refreshAllParameter": {},
                                                                                                                                "refreshComponentParameter": {}
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "dataFrom": "static",
                                                                                                                        "atrExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "elemExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "innerEvenet": {}
                                                                                                                    },
                                                                                                                    "type": "container",
                                                                                                                    "index": 0,
                                                                                                                    "label": "We are loo",
                                                                                                                    "styleList": [],
                                                                                                                    "refreshAllParameter": {},
                                                                                                                    "refreshComponentParameter": {}
                                                                                                                }
                                                                                                            ],
                                                                                                            "dataFrom": "static",
                                                                                                            "atrExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "styleList": [],
                                                                                                            "elemExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "innerEvenet": {}
                                                                                                        },
                                                                                                        "type": "container",
                                                                                                        "index": 1,
                                                                                                        "label": "We are loo",
                                                                                                        "styleList": [],
                                                                                                        "refreshAllParameter": {},
                                                                                                        "refreshComponentParameter": {}
                                                                                                    }
                                                                                                ],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "container",
                                                                                            "index": 0,
                                                                                            "label": "I need AI ",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "I need AI ",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            },
                                                                            {
                                                                                "id": "sfs9s4s6s3sfs3sb-sds8s6sf-4s8sds5-s8s8s9s7-s8ses7s3s1sas3s1s1s8s0s6",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "col mt-sm-5 mt-2 pt-sm-5",
                                                                                    "inner": "I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "sfs8s8sas2s9scs3-s0s4sas9-4sds6s1-sas8s2s4-ses1s8ses4s1s3s0scsfs9s5",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "div",
                                                                                                "class": "d-sm-grid d-flex gap-xl-4 gap-lg-3 gap-md-4 gap-sm-3 gap-2",
                                                                                                "inner": "I need MVP for startup\n                        \n                      \n                      \n                        \n                          I need web development",
                                                                                                "style": "",
                                                                                                "setting": [
                                                                                                    {
                                                                                                        "id": "sfs7sds7sfs0s5s4-sas0sbsa-4s6sfs3-sbs7s9s3-s0s3sbs6sdsds0scscs3s8se",
                                                                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                        "css": {
                                                                                                            "class": {},
                                                                                                            "style": {}
                                                                                                        },
                                                                                                        "data": {
                                                                                                            "attr": [],
                                                                                                            "elem": "div",
                                                                                                            "class": "d-flex align-items-center justify-content-center bg-secondary rounded-3 col-6 col-sm-12",
                                                                                                            "inner": "I need MVP for startup",
                                                                                                            "style": "min-height: 176px; backdrop-filter: blur(6px); -webkit-backdrop-filter:blur(6px);",
                                                                                                            "setting": [
                                                                                                                {
                                                                                                                    "id": "s0sfsas9s3sescs4-s6s8sas7-4s2sbs8-s9sds5s7-sds1s4s6s8s1sds1s9sfs2se",
                                                                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                    "css": {
                                                                                                                        "class": {},
                                                                                                                        "style": {}
                                                                                                                    },
                                                                                                                    "data": {
                                                                                                                        "attr": [],
                                                                                                                        "elem": "div",
                                                                                                                        "class": "p-xl-4 p-sm-3 p-2 fs-xl fw-semibold text-center",
                                                                                                                        "inner": "I need MVP for startup",
                                                                                                                        "style": "",
                                                                                                                        "setting": [
                                                                                                                            {
                                                                                                                                "id": "scs0s9s5s6s9sfse-sfscs9se-4s3s6s7-s8sas0s2-s4s1seses6sds3ses3s3sbse",
                                                                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                                "css": {
                                                                                                                                    "class": {},
                                                                                                                                    "style": {}
                                                                                                                                },
                                                                                                                                "data": {
                                                                                                                                    "attr": [],
                                                                                                                                    "elem": "span",
                                                                                                                                    "class": "hero-animation-fade hero-animation-delay-1 text-white",
                                                                                                                                    "inner": "網站開發",
                                                                                                                                    "style": "",
                                                                                                                                    "setting": [],
                                                                                                                                    "dataFrom": "static",
                                                                                                                                    "atrExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "elemExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "innerEvenet": {}
                                                                                                                                },
                                                                                                                                "type": "widget",
                                                                                                                                "index": 0,
                                                                                                                                "label": "I need MVP",
                                                                                                                                "styleList": [],
                                                                                                                                "refreshAllParameter": {},
                                                                                                                                "refreshComponentParameter": {}
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "dataFrom": "static",
                                                                                                                        "atrExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "elemExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "innerEvenet": {}
                                                                                                                    },
                                                                                                                    "type": "container",
                                                                                                                    "index": 0,
                                                                                                                    "label": "I need MVP",
                                                                                                                    "styleList": [],
                                                                                                                    "refreshAllParameter": {},
                                                                                                                    "refreshComponentParameter": {}
                                                                                                                }
                                                                                                            ],
                                                                                                            "dataFrom": "static",
                                                                                                            "atrExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "styleList": [],
                                                                                                            "elemExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "innerEvenet": {}
                                                                                                        },
                                                                                                        "type": "container",
                                                                                                        "index": 0,
                                                                                                        "label": "I need MVP",
                                                                                                        "styleList": [],
                                                                                                        "refreshAllParameter": {},
                                                                                                        "refreshComponentParameter": {}
                                                                                                    },
                                                                                                    {
                                                                                                        "id": "s3s2sfs3sbsas8s3-s1sds3s1-4seses4-s9scs2s1-scsbsdsbs8s1scs2s6s2s5se",
                                                                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                        "css": {
                                                                                                            "class": {},
                                                                                                            "style": {}
                                                                                                        },
                                                                                                        "data": {
                                                                                                            "attr": [],
                                                                                                            "elem": "div",
                                                                                                            "class": "d-flex align-items-center justify-content-center bg-secondary rounded-3 col-6 col-sm-12",
                                                                                                            "inner": "I need web development",
                                                                                                            "style": "min-height: 176px; backdrop-filter: blur(6px); -webkit-backdrop-filter:blur(6px);",
                                                                                                            "setting": [
                                                                                                                {
                                                                                                                    "id": "s7s2s0s2sas7s0s4-s7sbsbsc-4sasds2-s9s9s0s9-sbs2s0s1sds1s5sfs0s8s1s0",
                                                                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                    "css": {
                                                                                                                        "class": {},
                                                                                                                        "style": {}
                                                                                                                    },
                                                                                                                    "data": {
                                                                                                                        "attr": [],
                                                                                                                        "elem": "div",
                                                                                                                        "class": "p-xl-4 p-sm-3 p-2 fs-xl fw-semibold text-center",
                                                                                                                        "inner": "I need web development",
                                                                                                                        "style": "",
                                                                                                                        "setting": [
                                                                                                                            {
                                                                                                                                "id": "s6s2s6s9s1s0s1sc-s3sfsds8-4s0ses7-s8s0s5sa-s0s9s4s3s1s7s9s9s9s6scs2",
                                                                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                                                                "css": {
                                                                                                                                    "class": {},
                                                                                                                                    "style": {}
                                                                                                                                },
                                                                                                                                "data": {
                                                                                                                                    "attr": [],
                                                                                                                                    "elem": "span",
                                                                                                                                    "class": "hero-animation-fade hero-animation-delay-3 text-white",
                                                                                                                                    "inner": "整合開發",
                                                                                                                                    "style": "",
                                                                                                                                    "setting": [],
                                                                                                                                    "dataFrom": "static",
                                                                                                                                    "atrExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "elemExpand": {
                                                                                                                                        "expand": true
                                                                                                                                    },
                                                                                                                                    "innerEvenet": {}
                                                                                                                                },
                                                                                                                                "type": "widget",
                                                                                                                                "index": 0,
                                                                                                                                "label": "I need web",
                                                                                                                                "styleList": [],
                                                                                                                                "refreshAllParameter": {},
                                                                                                                                "refreshComponentParameter": {}
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        "dataFrom": "static",
                                                                                                                        "atrExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "elemExpand": {
                                                                                                                            "expand": true
                                                                                                                        },
                                                                                                                        "innerEvenet": {}
                                                                                                                    },
                                                                                                                    "type": "container",
                                                                                                                    "index": 0,
                                                                                                                    "label": "I need web",
                                                                                                                    "styleList": [],
                                                                                                                    "refreshAllParameter": {},
                                                                                                                    "refreshComponentParameter": {}
                                                                                                                }
                                                                                                            ],
                                                                                                            "dataFrom": "static",
                                                                                                            "atrExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "styleList": [],
                                                                                                            "elemExpand": {
                                                                                                                "expand": true
                                                                                                            },
                                                                                                            "innerEvenet": {}
                                                                                                        },
                                                                                                        "type": "container",
                                                                                                        "index": 1,
                                                                                                        "label": "I need web",
                                                                                                        "styleList": [],
                                                                                                        "refreshAllParameter": {},
                                                                                                        "refreshComponentParameter": {}
                                                                                                    }
                                                                                                ],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "container",
                                                                                            "index": 0,
                                                                                            "label": "I need MVP",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 1,
                                                                                "label": "I need MVP",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 1,
                                                                    "label": "I need AI ",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "I need AI ",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 1,
                                            "label": "I need AI ",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 0,
                                "label": "Top softwa",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                        ],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "container",
                    "index": 2,
                    "label": "Top softwa",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                }
            ],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "styleList": [],
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "container",
        "index": 1,
        "label": "Top softwa",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "sfs9sbsases6s3sc-sfs8s7s8-4ses0s7-sasas4se-s6s5s2scs4sfs4sbscsbs3sc",
        "js": "$style1/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [],
            "elem": "div",
            "class": "container",
            "inner": "",
            "setting": [
                {
                    "id": "s7sfs2s6seses5s5-s0s8s1sa-4s3s9s3-sasds3sa-s2sds5s4scs4s7sascsfscsc",
                    "js": "$style1/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "div",
                        "class": "alert alert-success mt-4 mx-1",
                        "inner": "「Beta版本現正開放免費測試中，所有功能均免費試用，但試用期限將有所限制。我們預計明年開始正式收費，屆時我們將提供更穩定、更全面的服務。敬請期待。」",
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": false
                        },
                        "styleList": [],
                        "elemExpand": [],
                        "innerEvenet": {}
                    },
                    "type": "widget",
                    "class": "m-2",
                    "index": 0,
                    "label": "HTML元件",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                }
            ],
            "atrExpand": {
                "expand": false
            },
            "styleList": [],
            "elemExpand": {
                "expand": true
            }
        },
        "type": "container",
        "index": 2,
        "label": "容器",
        "hashTag": "jeffcontainer",
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "scs9s0sas1s3sasc-sfs2s3s8-4s4s0s2-sas2s1sb-s1s9sfsfs4scs2s4sdsds8sf",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [],
            "elem": "section",
            "class": "container mb-5 py-lg-5 py-md-4 pt-2 ",
            "inner": "Our Services\n\n        \n        \n          \n            \n              Product Design\n              Nullam semper enim quis vulputate mollis. Donec ultrices elementum mauris, ac porttitor mi cursus eget. Vestibulum gravida risus et lacus finibus tincidunt. Vivamus dui ante, pharetra eu blandit ac, vulputate et diam eu faucibus.\n              \n              \n                UX/UI\n                Web design\n                Interactive design\n                Motion design\n              \n              Learn more\n            \n          \n          \n            \n              \n              \n            \n          \n        \n\n        \n        \n          \n            \n              Web Development\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in arcu ligula. Vestibulum euismod interdum risus eu interdum. Vivamus suscipit mauris at erat ultricies, vitae placerat nulla feugiat. Integer venenatis blandit efficitur.\n              \n              \n                \n                  \n                  \n                \n                \n                  \n                  \n                \n                \n                  \n                \n                \n                  \n                \n              \n              Learn more\n            \n          \n          \n            \n              \n              \n            \n          \n        \n\n        \n        \n          \n            \n              Software Testing\n              Phasellus posuere leo vitae quam faucibus cursus. Phasellus eu ex ultrices, facilisis ex at, aliquet felis. Cras id rutrum ante. Curabitur suscipit diam a facilisis laoreet. Duis id elit imperdiet eros vestibulum molestie. Nulla pellentesque justo enim,\n              \n                \n                  85+\n                  Tested projects\n                \n                \n                  200+\n                  Happy clients\n                \n              \n              Learn more",
            "style": "",
            "setting": [
                {
                    "id": "s3s6s6s8sfs0s9s9-s6s5s4sf-4s1s3s9-sascs6s0-sas9ses2s4s9s3s5s0sbsas2",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "section",
                        "class": "container mb-5",
                        "inner": "Сustom Software Solutions\n\n        \n        \n          \n\n            \n            \n              \n                \n                  \n                  Software Development\n                  Commodo senectus massa est urna mi. Mattis dis arcu aenean libero viverra gravida.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  App Development\n                  Enim vehicula integer mattis morbi risus. Hendrerit pharetra arcu quam viverra.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  Support & Maintenance\n                  Turpis ultrices lacinia ut placerat dignissim morbi. Amet lectus sed tortor in elit adipiscing magnis.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                        "style": "",
                        "setting": [
                            {
                                "id": "s6s0ses7sds3s2s5-s4sfscs3-4s9s5s5-sas8s8s2-sfs7s5s1s8s5s9s9s1sasds3",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [],
                                    "elem": "h2",
                                    "class": "h1 mb-lg-5 mb-4 pb-lg-0 pb-md-2 text-center",
                                    "inner": "我們提供的服務",
                                    "style": "",
                                    "setting": [],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "widget",
                                "index": 0,
                                "label": "Сustom Sof",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            },
                            {
                                "id": "s0sas3s2s0s2s6s3-s4s4s7sa-4s9ses8-s8s3ses0-s1scs1s3s1sas2s4s5sbsas7",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-swiper-options",
                                            "type": "par",
                                            "value": "{\n          \"spaceBetween\": 24,\n          \"breakpoints\": {\n            \"0\": {\n              \"slidesPerView\": 1\n            },\n            \"500\": {\n              \"slidesPerView\": 2\n            },\n            \"768\": {\n              \"slidesPerView\": 3\n            },\n            \"1200\": {\n              \"slidesPerView\": 4\n            }\n          },\n          \"pagination\": {\n            \"el\": \".swiper-pagination\",\n            \"clickable\": true\n          }\n        }",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "swiper mb-xl-3 swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden",
                                    "inner": "Software Development\n                  Commodo senectus massa est urna mi. Mattis dis arcu aenean libero viverra gravida.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  App Development\n                  Enim vehicula integer mattis morbi risus. Hendrerit pharetra arcu quam viverra.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  Support & Maintenance\n                  Turpis ultrices lacinia ut placerat dignissim morbi. Amet lectus sed tortor in elit adipiscing magnis.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                    "style": "",
                                    "setting": [
                                        {
                                            "id": "s9s8s0s8sbs1scse-s1scs5sd-4s0s9sc-s8s3s9sc-sas0sfs8s1sasbs5ses1s1sd",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "id",
                                                        "type": "par",
                                                        "value": "swiper-wrapper-7d5a10e102f9d51651",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-live",
                                                        "type": "par",
                                                        "value": "polite",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-wrapper",
                                                "inner": "Software Development\n                  Commodo senectus massa est urna mi. Mattis dis arcu aenean libero viverra gravida.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  App Development\n                  Enim vehicula integer mattis morbi risus. Hendrerit pharetra arcu quam viverra.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  Support & Maintenance\n                  Turpis ultrices lacinia ut placerat dignissim morbi. Amet lectus sed tortor in elit adipiscing magnis.\n                \n              \n            \n\n            \n            \n              \n                \n                  \n                  Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                "style": "transform: translate3d(-786px, 0px, 0px); transition-duration: 0ms;;",
                                                "setting": [
                                                    {
                                                        "id": "sesas4sasbs9s0s3-s3s5s2sa-4sesds3-s9ses1s8-sas4s6s8ses1s6sfs6sfs8sb",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "1 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto",
                                                            "inner": "Software Development\n                  Commodo senectus massa est urna mi. Mattis dis arcu aenean libero viverra gravida.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "s2sasbsasbs9scsc-sasds9s1-4s3sas7-sbsbs5s2-s2s0s2sds9s5s5sds5sas6s2",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "Software Development\n                  Commodo senectus massa est urna mi. Mattis dis arcu aenean libero viverra gravida.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "sbs7s7sas3scses3-s9s5ses8-4s0sasb-s8sesbs5-s9sas8sds3s9s3s9s6scs8s7",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "Software Development\n                  Commodo senectus massa est urna mi. Mattis dis arcu aenean libero viverra gravida.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "s1s9s6sds1s6scs0-sfsdscse-4s9s9s4-s8s4sesc-s6s2s3scs4sas3s1sbsfsbs9",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "i",
                                                                                                "class": "fa-light fa-globe text-gradient-primary   mb-3",
                                                                                                "inner": "",
                                                                                                "style": "\n     font-size: 28px;;\n  display: block;\n  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n                          ;;",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "sfs8sbs5sdscs6s9-sdsesfsb-4sasbs9-sbsas2sb-s9sbses8s9s8s1s4s3s4s5s3",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "網站開發",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "Software D",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "sfs1s8s5sbs9s2s5-s7s3s6s0-4s3s7se-sasbs9s6-s0s5s2sfs3sbs0sfs8sfs4s1",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "為您的企業或個人打造專屬的形象網站與應用，我們提供眾多網頁模板供您選擇，同時支援RWD / SEO / 個人網域，僅需3分鐘即可完成網站配置．",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Commodo se",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "Software D",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Software D",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "Software D",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s9scs6s5sbs7s2sd-sds7s6sc-4s3s6s4-s9s7s1s7-sfs6s0ses5s0sfs4sds6scsd",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "2 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto swiper-slide-prev",
                                                            "inner": "App Development\n                  Enim vehicula integer mattis morbi risus. Hendrerit pharetra arcu quam viverra.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "s6s2s6s4s0s8s4s4-s5sbs8s1-4s9s2s0-s9scs6s1-sds5scses8sas9scs2sas9s1",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "App Development\n                  Enim vehicula integer mattis morbi risus. Hendrerit pharetra arcu quam viverra.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "s5s8s8s5sbses4s5-s5s9scs8-4sbs2s5-s9sas3s5-s3s3s8seses4sas9sds4s0se",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "App Development\n                  Enim vehicula integer mattis morbi risus. Hendrerit pharetra arcu quam viverra.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "s4s0s8sfsfs9s8s9-sds7s6sc-4s3s5s0-s8s3s6s7-s5s5s6sesasdsds6s8s0s9s7",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Icon",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "img",
                                                                                                "class": "d-block mb-3 mx-auto",
                                                                                                "inner": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687189273611-168718927360239.20881821737363.svg",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "sasas1s5sesfsbsd-s4s3sesc-4s8sbsc-sas6sds5-s8s7s0sfsesesfs1s5s4s6s1",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "APP應用部署",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "App Develo",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s4s2s0s2s9sbsas6-s2sdsbs6-4s1s0s2-sbs4s9s2-s3sas3s8s6scs4ses1sbsas7",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "支援Android與IOS雙平台應用部署服務，透過後台即可一鍵送審與上架您的應用．",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Enim vehic",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "App Develo",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "App Develo",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 1,
                                                        "label": "App Develo",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s8sfs3sbscs6sesc-ses6s1s8-4sbses8-s8s7sas5-s8s1s0s5s4sfs0sesasas6s2",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "3 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto swiper-slide-active",
                                                            "inner": "Support & Maintenance\n                  Turpis ultrices lacinia ut placerat dignissim morbi. Amet lectus sed tortor in elit adipiscing magnis.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "s7sdsas3s3sds0s7-sbs3s2s1-4sfsbs6-s8s7s7s0-s9ses9s2s4s9s8s4s2s0sesa",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "Support & Maintenance\n                  Turpis ultrices lacinia ut placerat dignissim morbi. Amet lectus sed tortor in elit adipiscing magnis.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "sdsfsescs2ses5sb-s2s9s6s8-4sfs9sc-s8s5sfsf-s4s1s2scsfscsbs8scs8s9s1",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "Support & Maintenance\n                  Turpis ultrices lacinia ut placerat dignissim morbi. Amet lectus sed tortor in elit adipiscing magnis.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "scsfs7sds5s2s0s9-ses0sbsc-4sbses6-sbs8sdsc-s8s3s4s0s3s1s9s7s6s7s4s5",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Icon",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "i",
                                                                                                "class": "bx bxl-instagram-alt text-gradient-primary  mb-2",
                                                                                                "inner": "",
                                                                                                "style": "\n     font-size: 40px;;\n  display: block;\n  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n                          ;",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s3s6s0s6s5s0s3s8-s8sds3sd-4s9sfsd-sas6s9s0-scs6s3sasfs5s5scsbs5s2s7",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "社群模組 - 即將推出",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "Support & ",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s1s0s3s3s3sds9sa-sbscsasa-4s8sfs3-sasas7s9-sasds3s3sascs4sesds8s6s1",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "包含貼文，圖像，影片，活動，社團，訊息，留言，好友....等，如果您是網紅、自媒體，您還可以打造您的專屬內容，供用戶觀看，甚至透過分潤機制重中獲取收益．",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Turpis ult",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "Support & ",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Support & ",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 2,
                                                        "label": "Support & ",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s0s0s8s0scs6s6sd-s3s4s5s0-4s3scs0-s8s5s2sd-sascscsfs5sfs3sdsbsbsdsf",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "4 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto swiper-slide-next",
                                                            "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "s8s2s1sds9s4s4s2-sbsbsds0-4s5s8s9-s9s6s7sd-s7s0sfs5s5sbsescs7s3ses6",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "s7s6s9s0s8sas7s9-s4s1s7s0-4s9scs9-sbsbsbs5-ses3sas5s7s5s6sdsfsasesb",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "s0s1s9s6s9s3sbs5-s8sds4s4-4s4s3sc-s9s6sbs8-sbs2s9ses2sesbsdscs5sbsc",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Icon",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "i",
                                                                                                "class": "fa-regular fa-shop text-gradient-primary    mb-3",
                                                                                                "inner": "",
                                                                                                "style": "\n     font-size: 28px;;\n  display: block;\n  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n                          font-size:24px;;",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s4s6s0s4s3s0s6s4-s5s3s2s1-4s2s7s3-sas1s3s3-sds9s7s1scs9sescs3s3s6sd",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "電商模組 - 即將推出",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "Software Q",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "sasbs7sfs4s6scs6-s1s6s4sc-4sds3s1-sbsds5s0-sas0scs2s8sas1ses8s5s4sf",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "支援電商功能，透過平台販賣商品獲取收益，平臺採用綠界與藍新金流，支援超商取貨、ATM、信用卡付款等多重選項．   ",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Amet felis",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "Software Q",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Software Q",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 3,
                                                        "label": "Software Q",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sbs3s5s5sfs2s1s7-s5s3s9s9-4s3s0s2-s9sbs7sa-s7s5sdscscs7s5ses1s5s4s7",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "4 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto swiper-slide-next",
                                                            "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "sas0sds5sdscsds2-s8sfscs0-4sbscs7-s9s3ses0-sasfsds2sbscsas1s9sascse",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "sfsfs8s2sds9s9s1-sds6s1s1-4sas1s3-s8s0sbs3-sfs6s2s4sbs9sdsds7sas4s3",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "s8s3s0s2s3s1s1s6-sds5s2s5-4sds9sd-sas1sbs9-s0sescses7s9s6s1sfs8s1sb",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Icon",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "i",
                                                                                                "class": "  mb-3\nfa-regular fa-handshake text-gradient-primary  ",
                                                                                                "inner": "",
                                                                                                "style": "\n     font-size: 28px;;\n  display: block;\n  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n                          font-size:24px;;",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s9sfs6sasfs0sbsc-sbs2s0sc-4s8s4s1-sbs3s5sd-scs5sbscs7sdscs6s2sdsbs5",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "媒合模組 - 即將推出",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "Software Q",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "sesfsbs2s6s6scs3-sesfs1sd-4s7sas9-sasfsds5-s2s0s9s1s2s9scsbses5scs1",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "課程、家教、外包、清潔、水電、人力....等，各式媒合項目皆可自行設定．",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Amet felis",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "Software Q",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Software Q",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 4,
                                                        "label": "媒合模組",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sas9s4sfsfsas2se-sbs2s0sc-4s4s6s9-sas0s1s7-scsds2scsbscs5s8s3s0s6sd",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "4 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto swiper-slide-next",
                                                            "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "s3scses4s9s5sas1-s9sbscs6-4s1s2sd-sascs1sb-sfs3sbs8s2sds1s2ses5sasc",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "s5s9s1sdsfs4s9s8-s7s7s7s3-4s1sds4-sas1s3s1-s4s4s1scs9s7s8s5s2s6s6s2",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "sbs0s7s4s0sas3sc-ses0s5s7-4s1s8s6-sbs5s0sa-sbsascs2sbs9ses6s2s1scs4",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Icon",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "i",
                                                                                                "class": "   mb-3\nfa-sharp fa-regular fa-chart-mixed text-gradient-primary   ",
                                                                                                "inner": "",
                                                                                                "style": "\n     font-size: 28px;;\n  display: block;\n  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n                          font-size:24px;;",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s8s0ses6s7s8ses4-s1sfsfs3-4s8sase-sas6s8sa-sas3sesds6s7sfseses9sase",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "分析模組 - 即將推出",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "Software Q",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s5ses8s5s6sfs6s8-sds3s9s3-4s8s6sc-sas9s7s5-s9s5s5s3s1s9s3scs2sas2sf",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "為您統計網站每日流量，使用率，用戶登入次數，消費紀錄，收入增長．",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Amet felis",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "Software Q",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Software Q",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 5,
                                                        "label": "分析模組",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sbs8sbs7s1s1s8sa-s8s3s4sf-4ses8sd-sas9sdsc-s1sds7s4s6ses5sbs8sesbsb",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "4 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto swiper-slide-next",
                                                            "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "sds3sesds6sfsese-sdsbsfs7-4s0s3sc-s8s6s7sc-sbs6sbsas2s5s6s6s5s9s6s8",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "s0s8s9sbs3sescsd-s1sesdsa-4s4sbsf-s8s5scs1-s7s5ses9s4s8s6ses7s4sasc",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "s6s8sbs1sfs1sasd-scsds8s7-4sdsas4-sasfs1s6-s6s1ses2scsfs4s9sbs3sfs2",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Icon",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "i",
                                                                                                "class": "   mb-3\nfa-sharp fa-light fa-coins text-gradient-primary  ",
                                                                                                "inner": "",
                                                                                                "style": "\n     font-size: 28px;;\n  display: block;\n  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n                          font-size:24px;;",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "s8sds1sescsfs9sb-sbs4sbsa-4sasas0-s8sbs0s4-s4s9sases3s4scs8s7sfs3s8",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "分潤機制 - 即將推出",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "Software Q",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "scsas6s1s8s8s6s6-s1s6s3s7-4s0sesa-sasfsesd-sfs4s1s9sfscs3s4sds4s9s5",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "透過分潤系統，您可以設定訂閱或文章解鎖機制，從中獲取可觀收益．",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Amet felis",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "Software Q",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Software Q",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 6,
                                                        "label": "分析模組",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s9s3s4s7s9scsfsd-sds9s9s1-4s1s4sc-sas7s8s5-sdscses3s3s7s5s9sas6s2s4",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "group",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "4 / 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "swiper-slide h-auto swiper-slide-next",
                                                            "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                            "style": "width: 369px; margin-right: 24px;;",
                                                            "setting": [
                                                                {
                                                                    "id": "s4s7s0sas2ses4se-s0sesas1-4s3s1s3-s8s1sbs6-sfscsas8s9sdsas5sbsfs5s3",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "div",
                                                                        "class": "card h-100",
                                                                        "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                        "style": "",
                                                                        "setting": [
                                                                            {
                                                                                "id": "sas2sdsas7s1s3sb-s3s5s2s2-4sbs2s6-sbsas7sa-s9s3sfs9s3s4s6scses4scse",
                                                                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                "css": {
                                                                                    "class": {},
                                                                                    "style": {}
                                                                                },
                                                                                "data": {
                                                                                    "attr": [],
                                                                                    "elem": "div",
                                                                                    "class": "card-body my-md-5 my-4 py-xl-2 py-md-0 py-sm-2 text-center",
                                                                                    "inner": "Software QA & Testing\n                  Amet felis viverra proin feugiat. Eget metus metus lorem dolor pellentesque.",
                                                                                    "style": "",
                                                                                    "setting": [
                                                                                        {
                                                                                            "id": "sases0sfs8sesbse-s4sas5sf-4s2s1sf-sas0s8s8-s2s9s5s4s0s9ses6s7ses1s9",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [
                                                                                                    {
                                                                                                        "attr": "alt",
                                                                                                        "type": "par",
                                                                                                        "value": "Icon",
                                                                                                        "expand": false
                                                                                                    }
                                                                                                ],
                                                                                                "elem": "i",
                                                                                                "class": "   mb-3\nfa-regular fa-building text-gradient-primary   ",
                                                                                                "inner": "",
                                                                                                "style": "\n     font-size: 28px;;\n  display: block;\n  background: -webkit-linear-gradient(#9c47fc, #356ad2);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n                          font-size:24px;;",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "styleList": [],
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 0,
                                                                                            "label": "HTML元件",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "scscsfs7s8ses2s0-s4s8s1s8-4seses6-s9scs3sc-sfs7scs4s1sfs9sas3s1s5s4",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "h3",
                                                                                                "class": "h5 mb-3",
                                                                                                "inner": "企業模組 - 即將推出",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 1,
                                                                                            "label": "Software Q",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        },
                                                                                        {
                                                                                            "id": "sbscs5sfsdses7s7-sdsfs2sa-4s0s8s9-s8sbs2sa-s5s8s2s5s4s3sasfscs1s9s2",
                                                                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                                            "css": {
                                                                                                "class": {},
                                                                                                "style": {}
                                                                                            },
                                                                                            "data": {
                                                                                                "attr": [],
                                                                                                "elem": "p",
                                                                                                "class": "mb-0",
                                                                                                "inner": "企業模組，支援ERP、EIP、E-Form、出勤管理....等，各式各樣的企業類型應用．",
                                                                                                "style": "",
                                                                                                "setting": [],
                                                                                                "dataFrom": "static",
                                                                                                "atrExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "elemExpand": {
                                                                                                    "expand": true
                                                                                                },
                                                                                                "innerEvenet": {}
                                                                                            },
                                                                                            "type": "widget",
                                                                                            "index": 2,
                                                                                            "label": "Amet felis",
                                                                                            "styleList": [],
                                                                                            "refreshAllParameter": {},
                                                                                            "refreshComponentParameter": {}
                                                                                        }
                                                                                    ],
                                                                                    "dataFrom": "static",
                                                                                    "atrExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "elemExpand": {
                                                                                        "expand": true
                                                                                    },
                                                                                    "innerEvenet": {}
                                                                                },
                                                                                "type": "container",
                                                                                "index": 0,
                                                                                "label": "Software Q",
                                                                                "styleList": [],
                                                                                "refreshAllParameter": {},
                                                                                "refreshComponentParameter": {}
                                                                            }
                                                                        ],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "container",
                                                                    "index": 0,
                                                                    "label": "Software Q",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 7,
                                                        "label": "分析模組",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "Software D",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s8s8sfs6s8s9s0s3-sbsfsbsb-4s9s8sd-sases8s7-sbs1sbs2sbs9s0s8s0sfs2s5",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "swiper-pagination position-static mt-4 pt-lg-3 pt-2 swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal",
                                                "inner": "",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "sasas8sesfsfsese-s2s9sbs6-4sbs8s0-sas7s5s4-s7sascsbs3s3s1s2s2sases2",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "tabindex",
                                                                    "type": "par",
                                                                    "value": "0",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "button",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "Go to slide 1",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "span",
                                                            "class": "swiper-pagination-bullet",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s1s0s3s1sfscsfs0-s6sfs3s1-4s4scs7-sas6s3se-s8s2s3s5s1s7s4s7scses2s8",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "tabindex",
                                                                    "type": "par",
                                                                    "value": "0",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "button",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "Go to slide 2",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "span",
                                                            "class": "swiper-pagination-bullet",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sds3s9sfsdscs1sc-sfs6s1s9-4sfs6s1-s8s1s8s4-sdsfs5s3sfs2s8s4s2s4scs7",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "tabindex",
                                                                    "type": "par",
                                                                    "value": "0",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "button",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "Go to slide 3",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-current",
                                                                    "type": "par",
                                                                    "value": "true",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "span",
                                                            "class": "swiper-pagination-bullet swiper-pagination-bullet-active",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 2,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s5sfs9s0s7sfs0se-sds6s2s5-4s8sds5-s8s0s1s5-sas3sds7sesasfs2s4s7sbs5",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "tabindex",
                                                                    "type": "par",
                                                                    "value": "0",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "role",
                                                                    "type": "par",
                                                                    "value": "button",
                                                                    "expand": false
                                                                },
                                                                {
                                                                    "attr": "aria-label",
                                                                    "type": "par",
                                                                    "value": "Go to slide 4",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "span",
                                                            "class": "swiper-pagination-bullet",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 3,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 1,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s9s0s2s4sfs3s1s2-s6s5s1s4-4s0s8s6-sas1s1s7-s2s5scses1s3s4sesdsbs4sa",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "aria-live",
                                                        "type": "par",
                                                        "value": "assertive",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-atomic",
                                                        "type": "par",
                                                        "value": "true",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "span",
                                                "class": "swiper-notification",
                                                "inner": "",
                                                "style": "",
                                                "setting": [],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "widget",
                                            "index": 2,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 1,
                                "label": "Software D",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                        ],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "styleList": [],
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "container",
                    "index": 0,
                    "label": "Сustom Sof",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "s2s8s7s0s4s1sbs3-s3ses0s5-4scscs6-sascsas0-sfs6s6scs0s9s8s1sdsbsbsb",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "div",
                        "class": "row gy-4 mb-5 pb-xl-5 pb-md-4 pb-3 mt-sm-5",
                        "inner": "Product Design\n              Nullam semper enim quis vulputate mollis. Donec ultrices elementum mauris, ac porttitor mi cursus eget. Vestibulum gravida risus et lacus finibus tincidunt. Vivamus dui ante, pharetra eu blandit ac, vulputate et diam eu faucibus.\n              \n              \n                UX/UI\n                Web design\n                Interactive design\n                Motion design\n              \n              Learn more",
                        "style": "",
                        "setting": [
                            {
                                "id": "sbsbsas7s9ses4s4-sasfs3s6-4sas5s3-s8ses7sc-s5ses1s5s2sbs6s3ses7s6s5",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "-0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-lg-5 col-md-6 order-md-1 order-2 d-flex rellax",
                                    "inner": "Product Design\n              Nullam semper enim quis vulputate mollis. Donec ultrices elementum mauris, ac porttitor mi cursus eget. Vestibulum gravida risus et lacus finibus tincidunt. Vivamus dui ante, pharetra eu blandit ac, vulputate et diam eu faucibus.\n              \n              \n                UX/UI\n                Web design\n                Interactive design\n                Motion design\n              \n              Learn more",
                                    "style": "transform: translate3d(10px, 36px, 0px);;",
                                    "setting": [
                                        {
                                            "id": "s7s9s6s4s2ses1s3-s9s2s1s9-4s4s8s3-sbsas1s9-s1s3s7s2s5s5sbs3s7s5s3s2",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "align-self-center pe-lg-0 pe-md-4",
                                                "inner": "Product Design\n              Nullam semper enim quis vulputate mollis. Donec ultrices elementum mauris, ac porttitor mi cursus eget. Vestibulum gravida risus et lacus finibus tincidunt. Vivamus dui ante, pharetra eu blandit ac, vulputate et diam eu faucibus.\n              \n              \n                UX/UI\n                Web design\n                Interactive design\n                Motion design\n              \n              Learn more",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "s9s4s8s6s7scs5se-sbs4s4s0-4sfsfsd-sas3s1s7-sbs0sbs1s3s7scs4s6s3sdsa",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "h3",
                                                            "class": "mb-md-4",
                                                            "inner": "套版應用開發",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "Product De",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "scs5scsbs1s0sfs1-sesasdsc-4s0s2se-s9s3s5sf-sbsfsfsdsbses3s2s5sas7sf",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "p",
                                                            "class": "mb-md-4 mb-3 fs-lg",
                                                            "inner": "多款主題功能，助您快速打造專屬應用！我們提供支援形象網站、電子商務網站、媒合系統、課程系統、社群系統以及企業系統等多種功能。不僅如此，我們還同時支援響應式網頁設計（RWD）和行動應用程式（APP）。",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "Nullam sem",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s7s6s4s5s4scsasf-s3scs4s0-4scs5sa-sbsbs1s2-s7s7scsesds6s9s2s8s2sbs0",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "ul",
                                                            "class": "list-unstyled d-flex flex-wrap mt-md-n3 mt-n2 ms-md-n4 ms-n3 mb-0 pb-lg-4 pb-md-2 fw-bold",
                                                            "inner": "UX/UI\n                Web design\n                Interactive design\n                Motion design",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "scs9sas3sfs0sfs8-s4s6sds8-4s0s2se-sasesfs0-sfsdsfs9s8s2s9s9ses3s2s2",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "li",
                                                                        "class": "mt-md-3 mt-2 ms-md-4 ms-3",
                                                                        "inner": "<i class=\"fa-regular fa-globe me-1\"></i>RWD網頁",
                                                                        "style": "",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "UX/UI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                },
                                                                {
                                                                    "id": "s1s6s5s4sascs2s0-s0sfsbse-4sds7sc-s8scs0se-sbs7s1s0sfs3s3sesas6s7s7",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "li",
                                                                        "class": "mt-md-3 mt-2 ms-md-4 ms-3",
                                                                        "inner": "<i class=\"fa-brands fa-android me-1\"></i>Android",
                                                                        "style": "",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 1,
                                                                    "label": "Web design",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                },
                                                                {
                                                                    "id": "s9ses3ses4sas6s3-sfscsfs2-4scs1sd-sas5s9s6-sbs2sfsesfscs0s6s2s5s5se",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "li",
                                                                        "class": "mt-md-3 mt-2 ms-md-4 ms-3",
                                                                        "inner": "<i class=\"fa-brands fa-apple me-2\"></i>IOS",
                                                                        "style": "",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 2,
                                                                    "label": "Interactiv",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                },
                                                                {
                                                                    "id": "ses4sasbs3sas2s8-s9sfs1sf-4s5s4s2-s9sas3s6-s7s1s3s7s0s4s6sesas9s4s4",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "li",
                                                                        "class": "mt-md-3 mt-2 ms-md-4 ms-3",
                                                                        "inner": "<i class=\"fa-brands fa-expeditedssl me-1\"></i>SSL",
                                                                        "style": "",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": false
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 3,
                                                                    "label": "Motion des",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 2,
                                                        "label": "UX/UI\n    ",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s0sas2scs3s1s3s8-s2s9s6s2-4s4s3s7-sascs7s6-s1s1s2s6sfsas1s7s4sbscse",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "hr",
                                                            "class": "my-md-4 my-3",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 3,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "ses3s1sfs7s1s6sc-s5s7s2sd-4sasds9-s9s0s4sf-s2s5s1s4sbs8sbs7s9scs1sb",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "onclick",
                                                                    "type": "event",
                                                                    "expand": true,
                                                                    "clickEvent": [
                                                                        {
                                                                            "link": "select_template",
                                                                            "expand": true,
                                                                            "clickEvent": {
                                                                                "src": "$style1/event.js",
                                                                                "route": "link"
                                                                            },
                                                                            "pluginExpand": {
                                                                                "expand": true
                                                                            },
                                                                            "stackControl": "home",
                                                                            "dataPlaceExpand": {
                                                                                "expand": false
                                                                            },
                                                                            "errorPlaceExpand": {
                                                                                "expand": false
                                                                            },
                                                                            "link_change_type": "inlink"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "elem": "a",
                                                            "class": "btn btn-lg btn-outline-primary w-sm-auto w-100 mt-4",
                                                            "inner": "查看套版應用",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 4,
                                                        "label": "Learn more",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "Product De",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 0,
                                "label": "Product De",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            },
                            {
                                "id": "scs4s3sasbs1sas9-ses3sbsf-4sds3sc-sbsbs9sa-s4s0s5s3sesds2s1s2s8s9sf",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": true
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-md-6 offset-lg-1 order-md-2 order-1 rellax top-0",
                                    "inner": "",
                                    "style": "",
                                    "setting": [
                                        {
                                            "id": "s3s8s1sbs3s4s5s7-s9s5s0sa-4s4sds8-s8s8s7sb-s7sas1s3sasfs0sfs7s8s6s9",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "bg-secondary rounded-3",
                                                "inner": "",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "s8sbs5sfses6sbs4-s4s8sds8-4s0s8s7-sas5sbs3-s3s5s7sbsds7s4s6sfsbs5s7",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Image",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-none d-block p-3",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/guest/1687184729660-1683604789953-2.png",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s3s4sbsfscscses6-s9sas7s9-4s0s5se-s8s9s1s8-s8s3ses2s0s8s2s7s6sdsesc",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Image",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-block d-none",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687183412395-168718341237824.1411242034117.png",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "styleList": [],
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 1,
                                "label": "HTML元件",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                        ],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "styleList": [],
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "container",
                    "index": 1,
                    "label": "Product De",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "s4s4sas2s7s8sfs8-ses2s8s0-4s6s3sf-s9sasfs8-s1scs8s6s1sas3s8ses8s5sd",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "div",
                        "class": "row gy-4 mb-5 pb-xl-5 pb-md-4 pb-3",
                        "inner": "Web Development\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in arcu ligula. Vestibulum euismod interdum risus eu interdum. Vivamus suscipit mauris at erat ultricies, vitae placerat nulla feugiat. Integer venenatis blandit efficitur.\n              \n              \n                \n                  \n                  \n                \n                \n                  \n                  \n                \n                \n                  \n                \n                \n                  \n                \n              \n              Learn more",
                        "style": "",
                        "setting": [
                            {
                                "id": "s3s4sfs3sasas4s7-s4s6s7sb-4s8s2s0-s8sbsbsf-sbsfsbses8scscs5s2s5sas0",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "-0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-lg-5 col-md-6 order-md-1 order-2 d-flex rellax",
                                    "inner": "Web Development\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in arcu ligula. Vestibulum euismod interdum risus eu interdum. Vivamus suscipit mauris at erat ultricies, vitae placerat nulla feugiat. Integer venenatis blandit efficitur.\n              \n              \n                \n                  \n                  \n                \n                \n                  \n                  \n                \n                \n                  \n                \n                \n                  \n                \n              \n              Learn more",
                                    "style": "transform: translate3d(10px, 19px, 0px);;",
                                    "setting": [
                                        {
                                            "id": "s1s2sfs3sas1sfs9-s2scs5sf-4s6sfsb-s9s3sfs3-sas2sases4s9sas2s3scs6s3",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "align-self-center pe-lg-0 pe-md-4",
                                                "inner": "Web Development\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in arcu ligula. Vestibulum euismod interdum risus eu interdum. Vivamus suscipit mauris at erat ultricies, vitae placerat nulla feugiat. Integer venenatis blandit efficitur.\n              \n              \n                \n                  \n                  \n                \n                \n                  \n                  \n                \n                \n                  \n                \n                \n                  \n                \n              \n              Learn more",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "scs1s6s9s5s1s6s3-s8s1s0s0-4sbs2se-sbs6sbs2-s1sfs1ses2s1s1s3sfs4sfse",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "h3",
                                                            "class": "mb-md-4",
                                                            "inner": "低代碼整合開發",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "Web Develo",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s6s2s3s6s6sbs0s2-sfscsbs1-4s0s3sc-s9s6sds8-sas3s0sasfs8s6sbs7s2s9s1",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "p",
                                                            "class": "mb-md-4 mb-3 fs-lg",
                                                            "inner": "如果您是一位專業的程式設計師，我們提供的模塊式頁面編輯系統，讓您可以快速設計與打造您的網站與應用服務。<br><br>同時我們也支援各種內容發佈的API 和 Lambada Function，與官方插件，讓您可以自行設定和擴展網站和應用程式的功能。<br><br>\n無論您是初學者還是有豐富經驗的開發者，我們的模塊式頁面編輯系統都可以幫助您加速開發，並根據您的需求進行個性化設定和擴展。",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "Lorem ipsu",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sbs3s3s8sdsfs0s0-scs1s4s4-4s6s6s2-sbsfs9se-s2sasds3s6sds0ses0sds2sf",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "hr",
                                                            "class": "my-md-4 my-3",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 2,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s3sasfscs5s2s7s3-s9s0s3s4-4s1s2s8-s9s1s5s0-s0sdsbsbs0sesesfsas5sdsf",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "ul",
                                                            "class": "list-unstyled d-flex flex-wrap mt-md-n3 mt-n2 ms-md-n4 ms-n3 mb-0 pb-lg-4 pb-md-2 fw-bold",
                                                            "inner": "UX/UI\n                Web design\n                Interactive design\n                Motion design",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s8sds2sfs1s8s8sb-s3s6s4sc-4s0s5s6-sas1s1s6-sds1s4ses9sfs9s6sas8sas2",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "li",
                                                                        "class": "mt-md-3 mt-2 ms-md-4 ms-3",
                                                                        "inner": "<i class=\"fa-sharp fa-regular fa-paintbrush-pencil me-2\"></i>GUI編輯器",
                                                                        "style": "",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "UX/UI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                },
                                                                {
                                                                    "id": "scs2scs8s6sases4-sesds0se-4s5sas5-s9s8s0s4-sfsfs5sbscs5sdsas4s8s6s2",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "li",
                                                                        "class": "mt-md-3 mt-2 ms-md-4 ms-3",
                                                                        "inner": "<i class=\"fa-solid fa-puzzle-piece-simple me-2\"></i>插件開發",
                                                                        "style": "",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 1,
                                                                    "label": "Web design",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 3,
                                                        "label": "UX/UI\n    ",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sas2s0s1scs5s1s4-s5sdscs0-4s1s8s4-s9s2sbs6-s0sbsfs1s1s9sbs1sds8sbs8",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "onclick",
                                                                    "type": "event",
                                                                    "expand": true,
                                                                    "clickEvent": [
                                                                        {
                                                                            "link": "https://sam38124.github.io/GlitterTS/src/index.html?page=getting-started%2Fintroduction",
                                                                            "expand": true,
                                                                            "clickEvent": {
                                                                                "src": "$style1/event.js",
                                                                                "route": "link"
                                                                            },
                                                                            "pluginExpand": {
                                                                                "expand": true
                                                                            },
                                                                            "stackControl": "home",
                                                                            "dataPlaceExpand": {
                                                                                "expand": false
                                                                            },
                                                                            "errorPlaceExpand": {
                                                                                "expand": false
                                                                            },
                                                                            "link_change_type": "outlink"
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            "elem": "a",
                                                            "class": "btn btn-lg btn-outline-primary w-sm-auto w-100 mt-4",
                                                            "inner": "查看開發文件",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 4,
                                                        "label": "Learn more",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "Web Develo",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 0,
                                "label": "Web Develo",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            },
                            {
                                "id": "s0ses4sesbs2s3s2-s6sbsas2-4s4s4s8-s8s8scsc-s5s6sds5s6sbscs0s2s8sase",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": true
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-md-6 offset-lg-1 order-md-2 order-1 rellax",
                                    "inner": "",
                                    "style": "",
                                    "setting": [
                                        {
                                            "id": "s4sas4ses7s1s4s5-sbs7s1s3-4s2sbs8-sas5s9s5-s3s7s5s5s6sbsasds4sbsdsa",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "bg-secondary rounded-3",
                                                "inner": "",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "s2s6s7scs8sdsas5-s4s6s8s1-4sbs8sd-s9s0scs4-scs1sesds0s6sfscsds7s2s5",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Illustration",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-none d-block px-sm--3 py-sm-5  p-3",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/guest/1684069528009-exp.jpg",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sdscsasdscs1sfs7-scs0scsb-4s7sesd-s9s4s8s2-s6s8s2s0sds5sbsas9scs8sb",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Illustration",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-block d-none",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687183426478-168718342646036.136331520991384.png",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "styleList": [],
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 1,
                                "label": "HTML元件",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                        ],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "styleList": [],
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "container",
                    "index": 2,
                    "label": "Web Develo",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "sas5ses5sds0s3sb-s2s9s3s8-4sds4s5-s8s6s9se-s7sasfs6sas2s6scsbs4s4sf",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "div",
                        "class": "row gy-4 mb-xl-3",
                        "inner": "Software Testing\n              Phasellus posuere leo vitae quam faucibus cursus. Phasellus eu ex ultrices, facilisis ex at, aliquet felis. Cras id rutrum ante. Curabitur suscipit diam a facilisis laoreet. Duis id elit imperdiet eros vestibulum molestie. Nulla pellentesque justo enim,\n              \n                \n                  85+\n                  Tested projects\n                \n                \n                  200+\n                  Happy clients\n                \n              \n              Learn more",
                        "style": "",
                        "setting": [
                            {
                                "id": "s4s1sfsdses1s9sb-s3s1s1s1-4s4s4se-sasfsbs5-sfs2s4s6s9s7s8sds2sfs5s8",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "-0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-lg-5 col-md-6 order-md-1 order-2 d-flex rellax",
                                    "inner": "Software Testing\n              Phasellus posuere leo vitae quam faucibus cursus. Phasellus eu ex ultrices, facilisis ex at, aliquet felis. Cras id rutrum ante. Curabitur suscipit diam a facilisis laoreet. Duis id elit imperdiet eros vestibulum molestie. Nulla pellentesque justo enim,\n              \n                \n                  85+\n                  Tested projects\n                \n                \n                  200+\n                  Happy clients\n                \n              \n              Learn more",
                                    "style": "transform: translate3d(10px, 1px, 0px);;",
                                    "setting": [
                                        {
                                            "id": "s9sds5s2s1s2s7s5-s8s9s8sb-4sfs3s2-s8s4ses7-s6s4ses7s3sdsbsds1s9s3s2",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "align-self-center pe-lg-0 pe-md-4",
                                                "inner": "Software Testing\n              Phasellus posuere leo vitae quam faucibus cursus. Phasellus eu ex ultrices, facilisis ex at, aliquet felis. Cras id rutrum ante. Curabitur suscipit diam a facilisis laoreet. Duis id elit imperdiet eros vestibulum molestie. Nulla pellentesque justo enim,\n              \n                \n                  85+\n                  Tested projects\n                \n                \n                  200+\n                  Happy clients\n                \n              \n              Learn more",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "s6s5s9s9s6scs7s4-s1sasbs5-4sfs2s1-sascs4sf-s3s9scs9sas4sbsasdses5sd",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "h3",
                                                            "class": "mb-md-4",
                                                            "inner": "AI代碼生成",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "Software T",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "sds7s1s2s6ses8s6-sesasfs8-4s6s0sa-sas5s6s1-sas5scs1s4s5s4s3s9sdses9",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "p",
                                                            "class": "mb-md-4 mb-3 fs-lg",
                                                            "inner": "透過『Glitter.AI』的AI生成工具，我們可以快速幫助您生成所需的頁面樣式和內容。\n<br><br>\n您僅需要下達簡單的命令幾可產生所需的內容。\n<div class=\"alert alert-info  mt-4\" style=\"\">\n<span class=\"fr-strong\">範例:</span><br>\n<span>-.幫我生成一個H1標籤，字體大小為14px．</span>\n<br>\n<span>-.幫我使用bootstrap產生一個美觀的登入頁面．</span>\n<br>\n<span>-.幫我嵌入Youtube影片連結，https://www.youtube.com/watch?v=x9cUVX_SQdM</span>\n<br>\n</div>",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "Phasellus ",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "Software T",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 0,
                                "label": "Software T",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            },
                            {
                                "id": "s6s7sdsdses2s9sc-sas0sbs3-4s8ses4-sas6s8sd-scs4scses2s0s9s1s6s3s2s0",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.4",
                                            "expand": true
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "0.4",
                                            "expand": true
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": true
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-md-6 offset-lg-1 order-md-2 order-1 rellax",
                                    "inner": "",
                                    "style": "transform: translate3d(8px, -1px, 0px);;",
                                    "setting": [
                                        {
                                            "id": "s2sbs9s3s5s7sfs7-s6s6s9s2-4s3sas6-sbs6s0s0-s4s6s5s1s0s5s1s1seses4sf",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "bg-secondary rounded-3",
                                                "inner": "",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "sdsds7sascs0s1s5-s4s7sbs1-4s1s0s9-sas1s0sf-s3s7s3s7s1s5s6s7s6sas7s9",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Illustration",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-none d-block p-sm-3 p-2",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/guest/1687188036278-1686151670909-ai.jpeg",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s7s1s4s7s1s2sfs1-s2sds3s7-4s5s6s5-s9sas6sa-s7sds9s7sbses1s0s5s5sfs4",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Illustration",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-block d-none",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687183431368-168718343136167.3564795304522.png",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 1,
                                "label": "HTML元件",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                        ],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "container",
                    "index": 3,
                    "label": "Software T",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "s9s9sds1sas6s9sb-sfs5sesa-4s5s7sb-sas1s3s6-s1s3scs9s3s8sbsdscsdsbs5",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "div",
                        "class": "row gy-4 mb-xl-3  pb-3",
                        "inner": "Software Testing\n              Phasellus posuere leo vitae quam faucibus cursus. Phasellus eu ex ultrices, facilisis ex at, aliquet felis. Cras id rutrum ante. Curabitur suscipit diam a facilisis laoreet. Duis id elit imperdiet eros vestibulum molestie. Nulla pellentesque justo enim,\n              \n                \n                  85+\n                  Tested projects\n                \n                \n                  200+\n                  Happy clients\n                \n              \n              Learn more",
                        "style": "",
                        "setting": [
                            {
                                "id": "sasfs7s2s5s9s7s3-s1s7sds2-4s3s6sa-s9s2s4s2-sdsds1s0sfs0s2s0sas9sds6",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "-0.5",
                                            "expand": false
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-lg-5 col-md-6 order-md-1 order-2 d-flex rellax",
                                    "inner": "Software Testing\n              Phasellus posuere leo vitae quam faucibus cursus. Phasellus eu ex ultrices, facilisis ex at, aliquet felis. Cras id rutrum ante. Curabitur suscipit diam a facilisis laoreet. Duis id elit imperdiet eros vestibulum molestie. Nulla pellentesque justo enim,\n              \n                \n                  85+\n                  Tested projects\n                \n                \n                  200+\n                  Happy clients\n                \n              \n              Learn more",
                                    "style": "transform: translate3d(10px, 1px, 0px);;",
                                    "setting": [
                                        {
                                            "id": "ses2s3s4sas6s4s0-sfsdsfs8-4s2s1s7-sas0s1s7-s8s3s7s4sas7s0s9sas3sdsc",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "align-self-center pe-lg-0 pe-md-4",
                                                "inner": "Software Testing\n              Phasellus posuere leo vitae quam faucibus cursus. Phasellus eu ex ultrices, facilisis ex at, aliquet felis. Cras id rutrum ante. Curabitur suscipit diam a facilisis laoreet. Duis id elit imperdiet eros vestibulum molestie. Nulla pellentesque justo enim,\n              \n                \n                  85+\n                  Tested projects\n                \n                \n                  200+\n                  Happy clients\n                \n              \n              Learn more",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "ses4s8s7ses3s8s0-s4sds4s2-4s2s2sa-sas3s4sa-s1s2s4s5s8s3s7s3s0s6s3s5",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "h3",
                                                            "class": "mb-md-4",
                                                            "inner": "SAAS 拓展",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "Software T",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s9s2sbs4s5s1sbs3-sds1s2sf-4s9s1sb-sbs0sas0-s7sas5sds4s1s7sbsas6s0s0",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [],
                                                            "elem": "p",
                                                            "class": "mb-md-4 mb-3 fs-lg",
                                                            "inner": "您還可以將開發好的應用程式存入個人模板庫，或上傳至Glitter平台，供其他人使用。這樣可以方便分享和提供服務給更多的使用者。<br><br>\n並且您可以透過平台販賣您的模板與應用服務，從中獲取可觀收益．\n",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "Phasellus ",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s7s8s1s1scs5scse-sfsbs8sf-4sds1sb-s9sbs6se-sesas1s8scsesdsfs7sbs1se",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "a",
                                                            "class": "btn btn-lg btn-outline-primary w-sm-auto w-100 mt-4",
                                                            "inner": "查看所有模板",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 2,
                                                        "label": "Learn more",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "Software T",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 0,
                                "label": "Software T",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            },
                            {
                                "id": "s6s3s2s7s5sesbs0-sas9sesa-4ses0s5-sbsascsc-s1s3sesfs2s7s1s2s2sds9sd",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "data-rellax-percentage",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": true
                                        },
                                        {
                                            "attr": "data-rellax-speed",
                                            "type": "par",
                                            "value": "0.5",
                                            "expand": true
                                        },
                                        {
                                            "attr": "data-disable-parallax-down",
                                            "type": "par",
                                            "value": "md",
                                            "expand": true
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "col-md-6 offset-lg-1 order-md-2 order-1 rellax",
                                    "inner": "",
                                    "style": "transform: translate3d(8px, -1px, 0px);;",
                                    "setting": [
                                        {
                                            "id": "s0s8s6sds6s8s8s9-s7s2s4sc-4s6ses9-sas7scs9-sfs6s8sfs0s3s3s0s8sas6s9",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [],
                                                "elem": "div",
                                                "class": "bg-secondary rounded-3",
                                                "inner": "",
                                                "style": "",
                                                "setting": [
                                                    {
                                                        "id": "s9s9sds8s7s0s2s5-s4s0s1s5-4sfsdsd-sas0ses4-s1s3sas1s5sbs1ses3s8scs7",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Illustration",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-none d-block p-sm-3 p-2",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/guest/1687187497096-Screen Shot 2023-06-19 at 11.11.19 PM.png",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    },
                                                    {
                                                        "id": "s3s3s4s4s9sdsesf-s1sas5s1-4s8s9sc-s8sfs1sc-scs9sfs3s6s5sfs8s1s1s3s7",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "alt",
                                                                    "type": "par",
                                                                    "value": "Illustration",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "img",
                                                            "class": "d-dark-mode-block d-none",
                                                            "inner": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687183431368-168718343136167.3564795304522.png",
                                                            "style": "",
                                                            "setting": [],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "widget",
                                                        "index": 1,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 1,
                                "label": "HTML元件",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                        ],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "styleList": [],
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "container",
                    "index": 4,
                    "label": "Software T",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                }
            ],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "styleList": [],
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "container",
        "index": 3,
        "label": "Our Servic",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s0s4s0s7sds5scs0-s1s3s3s3-4sfs0s9-sbs0s6s4-sds2sesfs2s1sbsfs7scs6s3",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [],
            "elem": "section",
            "class": "container mb-5 pb-lg-5 pb-md-4 pb-3 mt-0",
            "inner": "",
            "style": "",
            "setting": [
                {
                    "id": "ses1s3sesbsas1s9-s1s6s4s3-4s4sbs9-s8s0s6s9-s3sds7s8s0s6s4sas3scscsb",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [],
                        "elem": "h2",
                        "class": "h1 mb-md-5 mb-4 pb-lg-2 pb-md-0 pb-sm-2 text-center mt-0",
                        "inner": "我們的客戶",
                        "style": "",
                        "setting": [],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "styleList": [],
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "widget",
                    "index": 0,
                    "label": "Our Servic",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "s4s9ses4s5ses3sc-s3s2s5s0-4s9s6s1-s9sdscsf-s2s8sas5ses4sas6s2s2s8s7",
                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "attr": [
                            {
                                "attr": "data-swiper-options",
                                "type": "par",
                                "value": "{\n          \"spaceBetween\": 8,\n          \"pagination\": {\n            \"el\": \".swiper-pagination\",\n            \"clickable\": true\n          },\n          \"breakpoints\": {\n            \"0\": {\n              \"slidesPerView\": 2\n            },\n            \"768\": {\n              \"slidesPerView\": 4\n            },\n            \"1200\": {\n              \"slidesPerView\": 6\n            }\n          }\n        }",
                                "expand": true
                            }
                        ],
                        "elem": "div",
                        "class": "swiper mx-n2 swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden",
                        "inner": "",
                        "style": "",
                        "setting": [
                            {
                                "id": "sfsbses6s3s5s7s3-s3s8sdsb-4scs8s0-s9s2sesf-s5sas1s1s8s7s1scs8s2sfsf",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "id",
                                            "type": "par",
                                            "value": "swiper-wrapper-7a6a71be00e3eb6e",
                                            "expand": false
                                        },
                                        {
                                            "attr": "aria-live",
                                            "type": "par",
                                            "value": "polite",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "div",
                                    "class": "swiper-wrapper",
                                    "inner": "",
                                    "style": "transform: translate3d(0px, 0px, 0px);;",
                                    "setting": [
                                        {
                                            "id": "s8s9s3s6s7s9sase-s2s8s7s7-4scs5s6-s8s4s1s1-s6sescs9sbs8s2scs5sescs8",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "group",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "1 / 4",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-slide py-3 swiper-slide-active",
                                                "inner": "",
                                                "style": "width: 200px; margin-right: 8px;;",
                                                "setting": [
                                                    {
                                                        "id": "s0s7s7ses0s7s8sc-s2s2s4s3-4ses1sa-s8s0sds8-sbs3s4s9s1sescs7sds5s6s5",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "card card-body card-hover px-2 mx-2",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "sbscs7s3sas9sfs8-sds1s2s4-4s7s6sd-sas1s6s3-sbs1sesesdsds2sasdsescs0",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "d-block mx-auto my-2 fw-bold fs-3",
                                                                        "inner": "HOMEEAI",
                                                                        "style": "color:gray;",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "HOMEEAI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 0,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s8sesfses6sasbs1-sasas6s7-4ses2s4-s8sescs7-s7s5s4s1s2s1s5s5sfsfscs8",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "group",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "1 / 4",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-slide py-3 swiper-slide-active",
                                                "inner": "",
                                                "style": "width: 200px; margin-right: 8px;;",
                                                "setting": [
                                                    {
                                                        "id": "scs7s0s8s4scscs4-s0sdsesd-4s3s1se-s9s1s4s1-sas6sfs7s9s3s1sdscs9s2s1",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "card card-body card-hover px-2 mx-2",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s0sas5sfsas4s9s5-s4s0s5se-4sfs9sb-sascs7se-s5s0s0sas5s8s7sdsas3s6s9",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "d-block mx-auto my-2 fw-bold fs-3",
                                                                        "inner": "橙的電子",
                                                                        "style": "color:gray;",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "HOMEEAI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 1,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "scs1s0s0s0s3scs9-s6sbsbs3-4s9scs3-s9ses8sf-s9s6sfsbs1s1sesdsbs6s5s4",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "group",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "1 / 4",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-slide py-3 swiper-slide-active",
                                                "inner": "",
                                                "style": "width: 200px; margin-right: 8px;;",
                                                "setting": [
                                                    {
                                                        "id": "s3s2s3s9s1sas6sa-s3s9s6s5-4sas8sb-sbs1s0sb-sas0sds4s0s8s5s0sfs5s5sc",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "card card-body card-hover px-2 mx-2",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s1s9s7scs7s4s5s0-scs4s8sf-4s8sas6-sbses5sb-s2sds8sbsbs7s7s7s5s1s4s5",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "d-block mx-auto my-2 fw-bold fs-3",
                                                                        "inner": "高雄醫學大學",
                                                                        "style": "color:gray;",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "HOMEEAI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 2,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s5sds5s7s9ses9s7-sfs4sas7-4s4s4s6-sas7scs4-ses3s4s0s3s1s7s0s8s5sdse",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "group",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "1 / 4",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-slide py-3 swiper-slide-active",
                                                "inner": "",
                                                "style": "width: 200px; margin-right: 8px;;",
                                                "setting": [
                                                    {
                                                        "id": "s4sbs3sfs7s7s7sb-s6s2s6s0-4s2s1s1-sas6sfs9-s1s5scscsas5scs7s4sbs5s4",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "card card-body card-hover px-2 mx-2",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s1scses2s3s3sbs9-s9ses7s7-4sfs5s8-sas7s0sb-sds4sdsds8sasds2sfs3sbs3",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "d-block mx-auto my-2 fw-bold fs-3",
                                                                        "inner": "御天科技",
                                                                        "style": "color:gray;",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "HOMEEAI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 3,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "scs6s5s7sfsas3s2-sbs0s1s0-4s2s3s0-sbscsbs8-s5s1s7scs8s7s0sds8s5s0sf",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "group",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "1 / 4",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-slide py-3 swiper-slide-active",
                                                "inner": "",
                                                "style": "width: 200px; margin-right: 8px;;",
                                                "setting": [
                                                    {
                                                        "id": "s8s6seses9s6sese-s6s1sasb-4sds0sb-sas7s3sb-s7s8sasesdscs1s5s7s3ses9",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "card card-body card-hover px-2 mx-2",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "scs4ses0s7sfs4sa-scs8scs5-4s5ses2-s8sbsds9-sas3sdsfs6sfs7sbs2s8s6s5",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "d-block mx-auto my-2 fw-bold fs-3",
                                                                        "inner": "緒玹科技",
                                                                        "style": "color:gray;",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "HOMEEAI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 4,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s4sds3s4sbs1s1s1-sesfs0s6-4s1sbse-s9s5s8sf-scs3s7s4sas1sas3s5s5sas4",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "group",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "1 / 4",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-slide py-3 swiper-slide-active",
                                                "inner": "",
                                                "style": "width: 200px; margin-right: 8px;;",
                                                "setting": [
                                                    {
                                                        "id": "s2s9s5s1s2s6s7s0-s1s3scs2-4s2sfs6-s9s0s3s8-s3sasfsfs9s8s4s9s2scscs5",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "card card-body card-hover px-2 mx-2",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s5sbscscs4s1s0sf-s2s3scs9-4s8s6se-sasas1s4-s4sds2sbsas8sbs2s7s0sbs1",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "d-block mx-auto my-2 fw-bold fs-3",
                                                                        "inner": "奇樂旅遊",
                                                                        "style": "color:gray;",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "HOMEEAI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 5,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s8sbses2sfsfs5sb-sds4s7sd-4sfs7se-s9s0s2s8-s0sfs9s0s3s1s9s2s7s2s4sf",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "group",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "1 / 4",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "div",
                                                "class": "swiper-slide py-3 swiper-slide-active",
                                                "inner": "",
                                                "style": "width: 200px; margin-right: 8px;;",
                                                "setting": [
                                                    {
                                                        "id": "s5scs5scs4s9s8s7-s6sesds4-4sds3s6-s8s4scsc-s7s7sds3s2scs6s9s2s2ses4",
                                                        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                        "css": {
                                                            "class": {},
                                                            "style": {}
                                                        },
                                                        "data": {
                                                            "attr": [
                                                                {
                                                                    "attr": "href",
                                                                    "type": "par",
                                                                    "value": "#",
                                                                    "expand": false
                                                                }
                                                            ],
                                                            "elem": "div",
                                                            "class": "card card-body card-hover px-2 mx-2",
                                                            "inner": "",
                                                            "style": "",
                                                            "setting": [
                                                                {
                                                                    "id": "s8s2s2sbs7sbsas8-sbs0s5s2-4sbscsa-s9sesesd-s9s7s3s7s7s9s3sds0s1s2s2",
                                                                    "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                                                    "css": {
                                                                        "class": {},
                                                                        "style": {}
                                                                    },
                                                                    "data": {
                                                                        "attr": [],
                                                                        "elem": "span",
                                                                        "class": "d-block mx-auto my-2 fw-bold fs-3",
                                                                        "inner": "萊恩設計",
                                                                        "style": "color:gray;",
                                                                        "setting": [],
                                                                        "dataFrom": "static",
                                                                        "atrExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "styleList": [],
                                                                        "elemExpand": {
                                                                            "expand": true
                                                                        },
                                                                        "innerEvenet": {}
                                                                    },
                                                                    "type": "widget",
                                                                    "index": 0,
                                                                    "label": "HOMEEAI",
                                                                    "styleList": [],
                                                                    "refreshAllParameter": {},
                                                                    "refreshComponentParameter": {}
                                                                }
                                                            ],
                                                            "dataFrom": "static",
                                                            "atrExpand": {
                                                                "expand": true
                                                            },
                                                            "styleList": [],
                                                            "elemExpand": {
                                                                "expand": true
                                                            },
                                                            "innerEvenet": {}
                                                        },
                                                        "type": "container",
                                                        "index": 0,
                                                        "label": "HTML元件",
                                                        "styleList": [],
                                                        "refreshAllParameter": {},
                                                        "refreshComponentParameter": {}
                                                    }
                                                ],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "styleList": [],
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "container",
                                            "index": 6,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 0,
                                "label": "HTML元件",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            },
                            {
                                "id": "s2s1s5s5s1s1s6sb-s6sfs7sf-4s8s7s6-s8s6s0sf-sfs0s1sfsds8s0sesbsfsbs9",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [],
                                    "elem": "div",
                                    "class": "swiper-pagination position-relative pt-2 mt-4 swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal",
                                    "inner": "",
                                    "style": "",
                                    "setting": [
                                        {
                                            "id": "s2s4sfsbs1s4s0sf-s4s0s1s2-4sds4s9-sasfs8s2-s3s3s8sbsbs5s1s4sesbsas7",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "tabindex",
                                                        "type": "par",
                                                        "value": "0",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "button",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "Go to slide 1",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-current",
                                                        "type": "par",
                                                        "value": "true",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "span",
                                                "class": "swiper-pagination-bullet swiper-pagination-bullet-active",
                                                "inner": "",
                                                "style": "",
                                                "setting": [],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "widget",
                                            "index": 0,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s5s9scs7s4sdsbs0-s6sds2s7-4s7sesf-s8scsas1-sbs7scsdsdscs4s7s2s6sbsa",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "tabindex",
                                                        "type": "par",
                                                        "value": "0",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "button",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "Go to slide 2",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "span",
                                                "class": "swiper-pagination-bullet",
                                                "inner": "",
                                                "style": "",
                                                "setting": [],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "widget",
                                            "index": 1,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        },
                                        {
                                            "id": "s9s4s9ses5s3ses7-s5sdscs9-4scscsf-s9s2scs3-s6s9sbscs4sbs8s5s9sbsbsf",
                                            "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                            "css": {
                                                "class": {},
                                                "style": {}
                                            },
                                            "data": {
                                                "attr": [
                                                    {
                                                        "attr": "tabindex",
                                                        "type": "par",
                                                        "value": "0",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "role",
                                                        "type": "par",
                                                        "value": "button",
                                                        "expand": false
                                                    },
                                                    {
                                                        "attr": "aria-label",
                                                        "type": "par",
                                                        "value": "Go to slide 3",
                                                        "expand": false
                                                    }
                                                ],
                                                "elem": "span",
                                                "class": "swiper-pagination-bullet",
                                                "inner": "",
                                                "style": "",
                                                "setting": [],
                                                "dataFrom": "static",
                                                "atrExpand": {
                                                    "expand": true
                                                },
                                                "elemExpand": {
                                                    "expand": true
                                                },
                                                "innerEvenet": {}
                                            },
                                            "type": "widget",
                                            "index": 2,
                                            "label": "HTML元件",
                                            "styleList": [],
                                            "refreshAllParameter": {},
                                            "refreshComponentParameter": {}
                                        }
                                    ],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "container",
                                "index": 1,
                                "label": "HTML元件",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            },
                            {
                                "id": "s2s3s4s4sfs2sas7-sesds3s7-4s8sesc-sasds8s8-s4s1s9sdscsbs6scs2s6s8s2",
                                "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
                                "css": {
                                    "class": {},
                                    "style": {}
                                },
                                "data": {
                                    "attr": [
                                        {
                                            "attr": "aria-live",
                                            "type": "par",
                                            "value": "assertive",
                                            "expand": false
                                        },
                                        {
                                            "attr": "aria-atomic",
                                            "type": "par",
                                            "value": "true",
                                            "expand": false
                                        }
                                    ],
                                    "elem": "span",
                                    "class": "swiper-notification",
                                    "inner": "",
                                    "style": "",
                                    "setting": [],
                                    "dataFrom": "static",
                                    "atrExpand": {
                                        "expand": true
                                    },
                                    "elemExpand": {
                                        "expand": true
                                    },
                                    "innerEvenet": {}
                                },
                                "type": "widget",
                                "index": 2,
                                "label": "HTML元件",
                                "styleList": [],
                                "refreshAllParameter": {},
                                "refreshComponentParameter": {}
                            }
                        ],
                        "dataFrom": "static",
                        "atrExpand": {
                            "expand": true
                        },
                        "elemExpand": {
                            "expand": true
                        },
                        "innerEvenet": {}
                    },
                    "type": "container",
                    "index": 1,
                    "label": "HTML元件",
                    "styleList": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                }
            ],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "styleList": [],
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "container",
        "index": 4,
        "label": "HTML元件",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s7sbscs9sds0s6sc-s6s2s9s2-4sdsfs3-s9s8s9sd-s4s9s5s5s4scscs9s3s8s8se",
        "js": "$style1/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "tag": "底部區塊",
            "list": [],
            "expand": true,
            "carryData": {}
        },
        "type": "component",
        "class": "",
        "index": 5,
        "label": "嵌入模塊",
        "style": "background:white;",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "sfs2s5s2s2sasfsa-s5s5sdsa-4ses7sb-s9sfsbsd-s2s2sesds7sfsbs9s7s4sfs9",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "type",
                    "type": "par",
                    "value": "text/css",
                    "expand": false
                },
                {
                    "attr": "rel",
                    "type": "par",
                    "value": "stylesheet",
                    "expand": false
                },
                {
                    "attr": "href",
                    "type": "par",
                    "value": "https://unpkg.com/aos@next/dist/aos.css",
                    "expand": true
                },
                {
                    "attr": "id",
                    "type": "par",
                    "value": "s8ses0s9s2s3s5s2-sbsbs3s7-4s8s7s1-sbs8sds0-scs4s8s2s2s6sbsds4s0s2s0",
                    "expand": false
                }
            ],
            "elem": "link",
            "note": "源代碼路徑:",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 6,
        "label": "style資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "sas6s3sbs3s0s2s4-s1s5sbs2-4s3sas8-s9s0sfs1-sas7s4s1s7ses7sasds7s3s0",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "src",
                    "type": "par",
                    "value": "https://unpkg.com/aos@next/dist/aos.js",
                    "expand": true
                },
                {
                    "attr": "id",
                    "type": "par",
                    "value": "sfs1sas5sds0sbsb-scsdsds2-4s4s0s2-sbs4s6sc-sfscscs8s6sbs6s1s7s2s4sb",
                    "expand": true
                }
            ],
            "elem": "script",
            "note": "源代碼路徑:",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 7,
        "label": "script資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "sbsfs3sasfs4s9sf-s5s9sfs0-4sas8sa-s8scs3s0-s4scsdsas5sfs4ses9s4s2sb",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "src",
                    "type": "par",
                    "value": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687190901152-168719090113510.22565380798046.js",
                    "expand": false
                }
            ],
            "elem": "script",
            "note": "源代碼路徑:http://localhost:63342/Silicon%202/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 8,
        "label": "script資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "ses7s3s9scs9s0s9-sasfsfs9-4s8s4s9-sbs0sfs6-sdses7s4s5sfs1sfsds1sas9",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "src",
                    "type": "par",
                    "value": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687190904095-168719090408638.19950611629499.js",
                    "expand": false
                }
            ],
            "elem": "script",
            "note": "源代碼路徑:http://localhost:63342/Silicon%202/assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 9,
        "label": "script資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s0sas6sbs1s5s2s6-sdsdsfs6-4sds7sc-sasfs4s9-s1scs7s3s5s2s0s5s9sasasc",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "src",
                    "type": "par",
                    "value": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687190906598-168719090658486.05937566449167.js",
                    "expand": false
                }
            ],
            "elem": "script",
            "note": "源代碼路徑:http://localhost:63342/Silicon%202/assets/vendor/swiper/swiper-bundle.min.js",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 10,
        "label": "script資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s3s3sasases2sas0-s9sfs1sa-4s2scsb-sbs6s8s0-s1s7s6s9scs5sas3s3s4s4sb",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "rel",
                    "type": "par",
                    "value": "stylesheet",
                    "expand": false
                },
                {
                    "attr": "media",
                    "type": "par",
                    "value": "screen",
                    "expand": false
                },
                {
                    "attr": "href",
                    "type": "par",
                    "value": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687191259288-168719125927038.22983261666284.css",
                    "expand": false
                }
            ],
            "elem": "link",
            "note": "源代碼路徑:http://localhost:63342/Silicon%202/assets/vendor/boxicons/css/boxicons.min.css",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 11,
        "label": "style資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s3s4sfscscs3sds5-s3s4s9s9-4s5sas2-s8s1s8s9-s1sfs1s3s2s2s5ses9s4s7sa",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "rel",
                    "type": "par",
                    "value": "stylesheet",
                    "expand": false
                },
                {
                    "attr": "media",
                    "type": "par",
                    "value": "screen",
                    "expand": false
                },
                {
                    "attr": "href",
                    "type": "par",
                    "value": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687191262118-168719126210842.40003213581653.css",
                    "expand": false
                }
            ],
            "elem": "link",
            "note": "源代碼路徑:http://localhost:63342/Silicon%202/assets/vendor/swiper/swiper-bundle.min.css",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 12,
        "label": "style資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "sdses4s9scs3s7s0-ses0s0s3-4s3sas1-s8s6s0s4-s9s8sfsases2s0s6s9s0ses5",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [
                {
                    "attr": "rel",
                    "type": "par",
                    "value": "stylesheet",
                    "expand": false
                },
                {
                    "attr": "media",
                    "type": "par",
                    "value": "screen",
                    "expand": false
                },
                {
                    "attr": "href",
                    "type": "par",
                    "value": "https://liondesign-prd.s3.amazonaws.com/file/252530754/1687191263783-168719126375487.05649168847773.css",
                    "expand": false
                }
            ],
            "elem": "link",
            "note": "源代碼路徑:http://localhost:63342/Silicon%202/assets/css/theme.min.css",
            "class": "",
            "inner": "",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 13,
        "label": "style資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s0s1s0s1s5scscs5-sesfs0s3-4scs5s1-sbsdsfs6-sas7sds6sesds4s2s2s8s0sa",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [],
            "elem": "style",
            "class": "",
            "inner": ".page-loading {\n        position: fixed;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        -webkit-transition: all .4s .2s ease-in-out;\n        transition: all .4s .2s ease-in-out;\n        background-color: #fff;\n        opacity: 0;\n        visibility: hidden;\n        z-index: 9999;\n      }\n      .dark-mode .page-loading {\n        background-color: #0b0f19;\n      }\n      .page-loading.active {\n        opacity: 1;\n        visibility: visible;\n      }\n      .page-loading-inner {\n        position: absolute;\n        top: 50%;\n        left: 0;\n        width: 100%;\n        text-align: center;\n        -webkit-transform: translateY(-50%);\n        transform: translateY(-50%);\n        -webkit-transition: opacity .2s ease-in-out;\n        transition: opacity .2s ease-in-out;\n        opacity: 0;\n      }\n      .page-loading.active > .page-loading-inner {\n        opacity: 1;\n      }\n      .page-loading-inner > span {\n        display: block;\n        font-size: 1rem;\n        font-weight: normal;\n        color: #9397ad;\n      }\n      .dark-mode .page-loading-inner > span {\n        color: #fff;\n        opacity: .6;\n      }\n      .page-spinner {\n        display: inline-block;\n        width: 2.75rem;\n        height: 2.75rem;\n        margin-bottom: .75rem;\n        vertical-align: text-bottom;\n        border: .15em solid #b4b7c9;\n        border-right-color: transparent;\n        border-radius: 50%;\n        -webkit-animation: spinner .75s linear infinite;\n        animation: spinner .75s linear infinite;\n      }\n      .dark-mode .page-spinner {\n        border-color: rgba(255,255,255,.4);\n        border-right-color: transparent;\n      }\n      @-webkit-keyframes spinner {\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      @keyframes spinner {\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 14,
        "label": "style資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    },
    {
        "id": "s6s0scsds0s7sfsf-s0s9s9s7-4ses8sb-sasesfsd-sbs0sbsdsas2sfsbs5s6ses9",
        "js": "https://sam38124.github.io/One-page-plugin/src/official.js",
        "css": {
            "class": {},
            "style": {}
        },
        "data": {
            "attr": [],
            "elem": "style",
            "class": "",
            "inner": "/* Spin animation */\n      @-webkit-keyframes hero-spin {\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      @keyframes hero-spin {\n        100% {\n          -webkit-transform: rotate(360deg);\n          transform: rotate(360deg);\n        }\n      }\n      .hero-animation-spin {\n        -webkit-animation: hero-spin 35s linear infinite;\n        animation: hero-spin 35s linear infinite;\n      }\n\n      /* Fade animation */\n      @-webkit-keyframes hero-fade {\n        0%, 100% { opacity: 0 }\n        50% { opacity: 1 }\n      }\n      @keyframes hero-fade {\n        0%, 100% { opacity: 0 }\n        50% { opacity: 1 }\n      }\n      .hero-animation-fade {\n        -webkit-animation: hero-fade 4s ease-in infinite;\n        animation: hero-fade 4s ease-in infinite;\n      }\n      .hero-animation-delay-1,\n      .hero-animation-delay-2,\n      .hero-animation-delay-3 {\n        opacity: 0;\n      }\n      .hero-animation-delay-1 { animation-delay: .75s; }\n      .hero-animation-delay-2 { animation-delay: 1.5s; }\n      .hero-animation-delay-3 { animation-delay: 2s; }",
            "style": "",
            "setting": [],
            "dataFrom": "static",
            "atrExpand": {
                "expand": true
            },
            "elemExpand": {
                "expand": true
            },
            "innerEvenet": {}
        },
        "type": "widget",
        "index": 15,
        "label": "style資源",
        "styleList": [],
        "refreshAllParameter": {},
        "refreshComponentParameter": {}
    }
]
function covert(data:any){
    if(Array.isArray(data)){
        data.map((dd:any)=>{
            covert(dd)
        })
    }else if(typeof data==='object'){
        Object.keys(data).map((d2)=>{
            covert(data[d2])
        })
        if(data.clickEvent&&data.clickEvent.src){
            data.clickEvent.src='replace event'
        }
        if(data.clickEvent&&Array.isArray(data.clickEvent)){
            data.clickEvent.map((dd:any)=>{
                covert(dd)
            })
        }
        if(data.js){
            data.js='replace'
        }
    }
}
covert(a)