import {GVC} from "../GVController.js";
import {EditorElem} from "./editor-elem.js";

export const styleAttr: { tag: string, title: string, innerHtml: (gvc: GVC, data: { [name: string]: string }) => string }[] = [
    {
        tag: "size", title: "大小", innerHtml: (gvc, data) => {
            const glitter = (window as any).glitter;
            return `
            <div class="alert alert-primary mt-2">
                <span class="fw-bold">範例:</span>100% ,100px,100em
            </div>
            ${ ['height', 'min-height', 'max-height', 'width', 'min-width', 'max-width'].map((dd, index) => {
                const k = ["高", "最小高度", "最大高度" , "寬", "最小寬度", "最大寬度" ][index]
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}`,
                    default: data[dd] ?? "",
                    placeHolder: `輸入${k}`,
                    callback: (text:string) => {
                        data[dd] = text
                    }
                })
            }).join('')}`
        }
    },
    {
        tag: "margin", title: "外距", innerHtml: (gvc, data) => {
            const glitter = (window as any).glitter;
            return `
            <div class="alert alert-primary mt-2">
                <span class="fw-bold">範例:</span>10px,10em,10pt,10%
            </div>
            ${ ['margin-left', 'margin-right', 'margin-top', 'margin-bottom'].map((dd, index) => {
                const k = ["左", "右", "上", "下"][index]
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側外距`,
                    default: data[dd] ?? "",
                    placeHolder: `輸入${k}側外距`,
                    callback: (text:string) => {
                        data[dd] = text
                    }
                })
            }).join('')}`
        }
    },
    {
        tag: "padding", title: "內距", innerHtml: (gvc, data) => {
            const glitter = (window as any).glitter;
            return `
            <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>
            ${ ['padding-left', 'padding-right', 'padding-top', 'padding-bottom'].map((dd, index) => {
                const k = ["左", "右", "上", "下"][index]
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側內距`,
                    default: data[dd] ?? "",
                    placeHolder: `輸入${k}側內距`,
                    callback: (text:string) => {
                        data[dd] = text
                    }
                })
            }).join('')}`
        }
    },
    {
        tag:"font",title:"字體設定",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;

            // data["font-size"]= data["font-size"]??"14px";
            // data["font-family"]= data["font-family"]??"Times New Roman";
            // data["font-weight"]= data["font-weight"]??"normal";
            // data["text-align"]= data["text-align"]??"center"
            // data["text-decoration"]= data["text-decoration"]??"none"
            // data["letter-spacing"]= data["letter-spacing"]??"normal"
            // data["line-height"]= data["line-height"]??"normal"
            // data["text-transform"]= data["text-transform"]??"none"
            // data["text-shadow"]= data["text-shadow"]??"none"
            // data["text-overflow"]= data["text-overflow"]??"clip"

            return `<div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
            </div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體大小`,
                default:data["font-size"]??"" ,
                placeHolder: `輸入字體大小`,
                callback: (text:string) => {
                    data["font-size"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>"Gill Sans", sans-serif 
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體`,
                default:data["font-family"]??"" ,
                placeHolder: `輸入字體需求`,
                callback: (text:string) => {
                    data["font-family"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span> normal,bold,400,700
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體粗細`,
                default:data["font-weight"]??"",
                placeHolder: `輸入字體粗細`,
                callback: (text:string) => {
                    data["font-weight"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>  left、right、center、justify
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `對齊方式`,
                default:data["text-align"]??"",
                placeHolder: `輸入如何對齊`,
                callback: (text:string) => {
                    data["text-align"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>underline、overline、line-through、none
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `文字效果`,
                default:data["text-decoration"]??"",
                placeHolder: `輸入字體粗細`,
                callback: (text:string) => {
                    data["text-decoration"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>normal , 1em , 1px
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字距`,
                default:data["letter-spacing"]??"",
                placeHolder: `輸入字距`,
                callback: (text:string) => {
                    data["letter-spacing"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>1px , 1% , 1 , 1em
            <div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `行高`,
                default:data["line-height"]??"",
                placeHolder: `輸入行高`,
                callback: (text:string) => {
                    data["line-height"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>uppercase , lowercase , capitalize
            </div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `大小寫轉換`,
                default:data["text-transform"]??"",
                placeHolder: `統一uppercase、lowercase、capitalize或none`,
                callback: (text:string) => {
                    data["text-transform"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>0.1em 0.1em 0.05em #333
</div><div class="mb-2" style="width: 100%;height: 1px;background-color: white;"></div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `字體陰影(向右,向下,模糊程度(可審略),顏色)`,
                default:data["text-shadow"] ,
                placeHolder: ``,
                callback: (text:string) => {
                    data["text-shadow"] = text
                }
            })+` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>clip,ellipsis,或是特定字串代替
</div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `文字溢出處理(太多會變省略號)`,
                default:data["text-overflow"] ,
                placeHolder: ``,
                callback: (text:string) => {
                    data["text-overflow"] = text
                }
            })

        }
    },
    {
        tag: "background", title: "背景設定", innerHtml: (gvc, data) => {
            const glitter = (window as any).glitter;
            return gvc.map([EditorElem.select({
                title: 'Attachment',
                gvc: gvc,
                def: data["background-attachment"],
                callback: (text: string) => {
                    data["background-attachment"]=text
                },
                array: ["fixed" , "local" , "scroll"],
            }),EditorElem.select({
                title: 'Clip',
                gvc: gvc,
                def: data["background-clip"],
                callback: (text: string) => {
                    data["background-clip"]=text
                },
                array: ["border-box" , "padding-box" , "content-box" , "text"],
            }),`<div class="alert alert-primary mt-2">
            <span class="fw-bold">背景顏色範例:</span> black,white,#000000,rgb(0,0,0)
            </div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `顏色`,
                default:data["background-color"] ,
                placeHolder: `輸入顏色`,
                callback: (text:string) => {
                    data["background-color"] = text
                }
            })+
            `
            <input id="palette" value="${data["background-color"]??""}" type="background-color" style="margin-top:10px;" onchange="${gvc.event((e:HTMLInputElement)=>{
                //todo 如果是輸入字串value=red時 這邊會顯示錯誤
                data["background-color"] = e.value
            })}">
            `,EditorElem.select({
                title: 'Origin',
                gvc: gvc,
                def: data["background-origin"],
                callback: (text: string) => {
                    data["background-origin"]=text
                },
                array: ["border-box" , "padding-box" , "content-box" , ""],
            }),EditorElem.select({
                title: '位置',
                gvc: gvc,
                def: data["background-origin"],
                callback: (text: string) => {
                    data["background-origin"]=text
                },
                array: ["border-box" , "padding-box" , "content-box" , ""],
            }),`<div class="alert alert-primary mt-2">
            <span class="fw-bold">背景位置:</span> top , left , bottom , right,50% 
            </div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: ``,
                default:data["background-color"] ,
                placeHolder: `輸入顏色`,
                callback: (text:string) => {
                    data["background-color"] = text
                }
            }),EditorElem.select({
                title: '重複',
                gvc: gvc,
                def: data["background-repeat"],
                callback: (text: string) => {
                    data["background-repeat"]=text
                },
                array: ["repeat" , "no-repeat" , "repeat-x" , "repeat-y","round" , "space"],
            }),EditorElem.select({
                title: '重複',
                gvc: gvc,
                def: data["background-repeat"],
                callback: (text: string) => {
                    data["background-repeat"]=text
                },
                array: ["repeat" , "no-repeat" , "repeat-x" , "repeat-y","round" , "space"],
            })])
        }
    },
    {
        tag:"background-image",title:"背景圖片",innerHtml: (gvc, data) =>{
            data["background-image"]= data["background-image"]??""
            data["background-repeat"]=data["background-repeat"]??"repeat"
            return  gvc.bindView(()=>{
                const id=gvc.glitter.getUUID()
                return {
                    bind:id,
                    view:()=>{
                        return gvc.map([EditorElem.uploadImage({
                            gvc: gvc,
                            title: `背景圖`,
                            def: data["background-image"],
                            callback: (dd:any) => {
                                if(dd.indexOf(`url('`)===-1){
                                    data["background-image"] = `url('${dd}')`;
                                }
                                gvc.notifyDataChange(id)
                            },
                        }),EditorElem.select({
                            title: '是否重複繪圖',
                            gvc: gvc,
                            def: data["background-repeat"],
                            callback: (text: string) => {
                                data["background-repeat"]=text
                            },
                            array: [{title:"是",value:"repeat"},{title:"否",value:"no-repeat"}],
                        })])
                    },
                    divCreate:{}
                }
            })
        }
    },
    {
        tag:"color",title:"顏色",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["color"]= data["color"]??"black"
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span> black,white,#000000,rgb(0,0,0)
</div>`+glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `顏色`,
                    default:data["color"] ,
                    placeHolder: `輸入顏色`,
                    callback: (text:string) => {
                        data["color"] = text
                    }
                })+
                `
            <input id="palette" value="${data["color"]??"black"}" type="color" style="margin-top:10px;" onchange="${gvc.event((e:HTMLInputElement)=>{
                    //todo 如果是輸入字串value=red時 這邊會顯示錯誤
                    data["color"] = e.value
                })}">
            `
        }
    },
    {
        tag:"border",title:"邊線設計",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            let prefix = "border"
            //border-radius border-color border-width border-style border-image border-collapse border-spacing

            return `
            ${EditorElem.select({
                title: "設定邊線位置",
                gvc: gvc,
                def: "全部",
                array: ["上", "下", "左", "右", "全部"],
                callback: (text: string) => {
                    switch (text){
                        case "上":{
                            prefix = "border-top";
                            break;
                        }
                        case "下":{
                            prefix = "border-bottom";
                            break;
                        }
                        case "左":{
                            prefix = "border-left";
                            break;
                        }
                        case "右":{
                            prefix = "border-right";
                            break;
                        }
                        case "全部":{
                            prefix = "border";
                            break;
                        }
                    }
                }
            })}
            ${glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `寬度 (1px , 1% , 1em)`,
                default:data[`${prefix}-width`] ,
                placeHolder: ``,
                callback: (text:string) => {
                    data[`${prefix}-width`] = text
                }
            })}
            ${glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `顏色(black,white,#000000,rgb(0,0,0))`,
                default:data[`${prefix}-color`] ,
                placeHolder: ``,
                callback: (text:string) => {
                    data[`${prefix}-color`] = text
                }
            })}
            `
        }
    },
    {
        tag: "border-radius", title: "圓角", innerHtml: (gvc, data) => {
            const glitter = (window as any).glitter;
            return `
            <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>10px,10em,10pt,10%
</div>
            ${['border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'].map((dd, index) => {
                const k = ["左上", "右上", "左下", "右下"][index]
                return glitter.htmlGenerate.editeInput({
                    gvc: gvc,
                    title: `${k}側圓角`,
                    default: data[dd] ?? "",
                    placeHolder: `輸入${k}側圓角`,
                    callback: (text:string) => {
                        data[dd] = text
                    }
                })
            }).join('')}`
        }
    },
    {
        tag:"aspect-ratio",title:"畫面比例",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["aspect-ratio"]= data["aspect-ratio"]??"auto"
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>1/1 , 0.5 , auto
</div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `畫面比例`,
                default:data["aspect-ratio"] ,
                placeHolder: `輸入比值`,
                callback: (text:string) => {
                    data["aspect-ratio"] = text
                }
            })
        }
    },
    {
        tag:"box-sizing",title:"box-sizing",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["box-sizing"]= data["box-sizing"]??"content-box"
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>Content-box,Border-box 
</div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `行高`,
                default:data["box-sizing"] ,
                placeHolder: `輸入行高`,
                callback: (text:string) => {
                    data["box-sizing"] = text
                }
            })
        }
    },
    {
        tag:"display",title:"display排版",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["display"]= data["display"]??"none"
            return `<div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>none,block,inline,inline-block,flex,grid
            </div>`+EditorElem.select({
                    title: 'display',
                    gvc: gvc,
                    def: data["display"],
                    callback: (text: string) => {
                        data["display"]=text
                        gvc.notifyDataChange(['displayDetail']);
                    },
                    array: ["none","block","inline","inline-block","flex","grid"],
                })+
                gvc.bindView({
                    bind:"displayDetail",
                    view:()=>{
                        if (data["display"] == "flex"){
                            return gvc.map([glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `flex-basis`,
                                default:data["flex-basis"] ,
                                placeHolder: `輸入元素的基本大小`,
                                callback: (text:string) => {
                                    data["flex-basis"] = text
                                }
                            }),
                                EditorElem.select({
                                    title: 'direction',
                                    gvc: gvc,
                                    def: data["flex-direction"],
                                    callback: (text: string) => {
                                        data["flex-direction"]=text
                                    },
                                    array: ["row","row-reverse","column","column-reverse"],
                                }),
                                EditorElem.select({
                                    title: 'wrap',
                                    gvc: gvc,
                                    def: data["flex-wrap"],
                                    callback: (text: string) => {
                                        data["flex-wrap"]=text
                                    },
                                    array: ["wrap","wrap-reverse","nowrap"],
                                }),
                                glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `flex-grow`,
                                    default:data["flex-grow"] ,
                                    placeHolder: `flex-grow的數值`,
                                    callback: (text:string) => {
                                        data["flex-grow"] = text
                                    }
                                }),
                                glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `flex-shrink`,
                                    default:data["flex-shrink"] ,
                                    placeHolder: `flex-shrink的數值`,
                                    callback: (text:string) => {
                                        data["flex-shrink"] = text
                                    }
                                }),
                                glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `order`,
                                    default:data["order"] ,
                                    placeHolder: `order的次序`,
                                    callback: (text:string) => {
                                        data["order"] = text
                                    }
                                }),
                                EditorElem.select({
                                    title: 'justify-content',
                                    gvc: gvc,
                                    def: data["justify-content"],
                                    callback: (text: string) => {
                                        data["justify-content"]=text
                                    },
                                    array: ["normal","flex-start","flex-end","center","space-between","space-around","space-evenly","stretch"],
                                }),
                                EditorElem.select({
                                    title: 'align-items',
                                    gvc: gvc,
                                    def: data["align-items"],
                                    callback: (text: string) => {
                                        data["align-items"]=text
                                    },
                                    array: ["flex-start" , "flex-end" ,"center","baseline","stretch"],
                                }),
                                EditorElem.select({
                                    title: 'align-self',
                                    gvc: gvc,
                                    def: data["align-self"],
                                    callback: (text: string) => {
                                        data["align-self"]=text
                                    },
                                    array: ["auto","flex-start" , "flex-end" ,"center","baseline","stretch"],
                                }),



                            ])
                        }
                        return``
                    },divCreate:{}
                })
        }
    },
    {
        tag:"object-fit",title:"內部元素大小",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["object-fit"]= data["object-fit"]??"none"
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>fill,cover,contain,none,scale-down, 
            </div>`+EditorElem.select({
                title: 'object-fit',
                gvc: gvc,
                def: data["object-fit"],
                callback: (text: string) => {
                    data["object-fit"]=text
                },
                array: ["fill","cover","contain","none","scale-down", ],
            })
        }
    },
    {
        tag:"object-position",title:"內部元素位置",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["object-position"]= data["object-position"]??"center"
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>center , top , bottom , left , right , top left , bottom right 
            </div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `內部元素位置`,
                default:data["object-position"] ,
                placeHolder: `輸入內部元素位置`,
                callback: (text:string) => {
                    data["object-position"] = text
                }
            })
        }
    },
    {
        tag:"overflow",title:"內容物溢出",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            let prefix = "overflow"
            data[prefix]="auto"
            //border-radius border-color border-width border-style border-image border-collapse border-spacing

            return `
            ${EditorElem.select({
                title: "設定溢出方向",
                gvc: gvc,
                def: "全部",
                array: ["垂直方向", "水平方向", "全部"],
                callback: (text: string) => {
                    switch (text){
                        case "垂直方向":{
                            prefix = "overflow-y";
                            break;
                        }
                        case "水平方向":{
                            prefix = "overflow-x";
                            break;
                        }
                        case "全部":{
                            prefix = "overflow";
                            break;
                        }
                    }
                }
            })}
            ${EditorElem.select({
                title: "溢出的處理方式",
                gvc: gvc,
                def: "auto",
                array: ["auto", "hidden", "clip" , "visible" , "scroll"],
                callback: (text: string) => {
                    data[prefix]=text
                }
            })}
            `
        }
    },
    {
        tag:"position",title:"位置",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;

            return `
            ${EditorElem.select({
                title: "位置",
                gvc: gvc,
                def: "static",
                array: ["static", "fixed", "absolute" , "relative" , "sticky"],
                callback: (text: string) => {
                    data["position"]=text
                }
            })}
            ${(()=>{
                return gvc.bindView({
                    bind:"position",
                    view:()=>{
                        if (data["position"]!="static"){
                            let returnHTML = ``

                            return `
                            ${ ['left', 'right', 'top', 'bottom'].map((dd, index) => {
                                const k = ["左", "右", "上", "下"][index]
                                return glitter.htmlGenerate.editeInput({
                                    gvc: gvc,
                                    title: `${k}方距離，同個方向只會取前者(左or右 上or下)`,
                                    default: data[dd] ?? "",
                                    placeHolder: `輸入${k}側距離`,
                                    callback: (text:string) => {
                                        data[dd] = text
                                    }
                                })
                            }).join('')}
                            ${glitter.htmlGenerate.editeInput({
                                gvc: gvc,
                                title: `排列先後(z-index)`,
                                default:data["z-index"] ,
                                placeHolder: `輸入先後次序`,
                                callback: (text:string) => {
                                    data["z-index"] = text
                                }
                            })}
                            `
                        }


                        return ``
                    },divCreate:{}
                })
            })()}
            `
        }
    },
    {
        tag:"Box Shadow",title:"容器陰影",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["box-shadow"]= data["box-shadow"]??""
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>0 1px 2px 0 rgb(0 0 0 / 0.05);
</div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `畫面比例`,
                default:data["box-shadow"] ,
                placeHolder: `輸入陰影屬性`,
                callback: (text:string) => {
                    data["box-shadow"] = text
                }
            })
        }
    },
    {
        tag:"Opacity",title:"透明度",innerHtml: (gvc, data) =>{
            const glitter = (window as any).glitter;
            data["opacity"]= data["opacity"]??""
            return ` <div class="alert alert-primary mt-2">
            <span class="fw-bold">範例:</span>0~1 , 0.05 , 0.5
</div>`+glitter.htmlGenerate.editeInput({
                gvc: gvc,
                title: `透明度`,
                default:data["opacity"] ,
                placeHolder: `輸入透明度`,
                callback: (text:string) => {
                    data["opacity"] = text
                }
            })
        }
    }
]