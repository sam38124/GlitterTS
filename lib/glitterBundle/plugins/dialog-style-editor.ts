import {GVC, init} from '../GVController.js';
import {EditorElem} from "./editor-elem.js";

const html = String.raw

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const styleData: {
                style: string,
                class: string,
                style_from: 'manual' | 'code',
                stylist: {
                    style: string,
                    class: string,
                    size: number | string
                }[]
            } = gBundle.data
            styleData.style_from = styleData.style_from ?? 'code'
            styleData.stylist = styleData.stylist ?? []
            const id = gvc.glitter.getUUID()
            function migrateFrSize(key: 'style' | 'class') {
                try {
                    if (styleData[key].trim().startsWith('glitter.ut.frSize')) {
                        const data = styleData[key].trim().replace(`glitter.ut.frSize(`, '')
                        let f1: any = `(()=>{
                return ${data.substring(0, data.lastIndexOf(`},`))}}
                })()`
                        f1 = eval(f1)
                        let f2 = data.substring(data.lastIndexOf(`},`) + 2, data.length - 1)
                        f2 = eval(f2)
                        styleData[key] = f2
                        Object.keys(f1).map((d1) => {
                            let waitPost: any = styleData.stylist.find((d2) => {
                                return d2.size === d1
                            })
                            if (!waitPost) {
                                waitPost = {
                                    size: d1,
                                    style: ``,
                                    class: ``
                                }
                                styleData.stylist.push(waitPost)
                            }
                            waitPost[key] = f1[d1]
                        })
                    }
                } catch (e) {

                }
            }
            migrateFrSize("class")
            migrateFrSize("style")
            return html`
                <div class="vw-100 vh-100 d-flex align-items-center justify-content-center"
                     style="background:rgba(0,0,0,0.6);">
                    <div class="bg-white rounded" style="max-height:90vh;max-width:900px;">
                        <div class="d-flex w-100 border-bottom align-items-center" style="height:50px;">
                            <h3 style="font-size:15px;font-weight:500;" class="m-0 ps-3">
                                設定CSS樣式</h3>
                            <div class="flex-fill"></div>
                            <div class="hoverBtn p-2 me-2" style="color:black;font-size:20px;"
                                 onclick="${gvc.event(() => {
                                     gvc.closeDialog()
                                     gBundle.callback()
                                 })}"
                            ><i class="fa-sharp fa-regular fa-circle-xmark"></i>
                            </div>
                        </div>
                        <div class="d-flex " style="">
                            <div>
                                ${gvc.bindView(() => {
                                    return {
                                        bind: id,
                                        view: () => {

                                            return html`
                                                <div class="d-flex">
                                                    <div style="width:400px;" class="border-end  pb-2">
                                                        ${gvc.bindView(() => {
                                                            const id = gvc.glitter.getUUID()
                                                            return {
                                                                bind: id,
                                                                view: () => {
                                                                    return [
                                                                        `<div class="mx-2">${EditorElem.select({
                                                                            title: '設定樣式來源',
                                                                            gvc: gvc,
                                                                            def: styleData.style_from,
                                                                            array: [
                                                                                {title: "程式碼", value: "code"}
                                                                            ],
                                                                            callback: (text) => {
                                                                                styleData.style_from = text as any
                                                                                gvc.notifyDataChange(id)
                                                                            }
                                                                        })}</div>`,
                                                                        (() => {
                                                                            if (styleData.style_from === 'code') {
                                                                                function editIt(gvc: GVC, data: any) {
                                                                                    data.class = (data.class ?? "").trim()
                                                                                    data.style = (data.style ?? "").trim()
                                                                                    return [
                                                                                        gvc.bindView(() => {
                                                                                            const id = glitter.getUUID()
                                                                                            data.classDataType = data.classDataType ?? "static"
                                                                                            return {
                                                                                                bind: id,
                                                                                                view: () => {
                                                                                                    return [
                                                                                                        `
                                                                                                     <h3 style="color: black;font-size: 24px;margin-bottom: 10px;" class="fw-bold mt-2">CLASS參數</h3> 
                                                                                                        `,
                                                                                                        EditorElem.select({
                                                                                                            title: "設定參數資料來源",
                                                                                                            gvc: gvc,
                                                                                                            def: data.classDataType,
                                                                                                            array: [
                                                                                                                {
                                                                                                                    title: '靜態來源',
                                                                                                                    value: 'static'
                                                                                                                },
                                                                                                                {
                                                                                                                    title: '程式碼',
                                                                                                                    value: 'code'
                                                                                                                }
                                                                                                            ],
                                                                                                            callback: (text) => {
                                                                                                                data.classDataType = text
                                                                                                                gvc.notifyDataChange(id)
                                                                                                            }
                                                                                                        }),
                                                                                                            `<div class="mt-2"></div>`,
                                                                                                        (()=>{
                                                                                                            if(data.classDataType==='static'){
                                                                                                                return EditorElem.editeText({
                                                                                                                    gvc: gvc,
                                                                                                                    default: data.class,
                                                                                                                    title: ``,
                                                                                                                    placeHolder:``,
                                                                                                                    callback: (text) => {
                                                                                                                        data.class = text
                                                                                                                    }
                                                                                                                })
                                                                                                            }else{
                                                                                                                return EditorElem.codeEditor({
                                                                                                                    gvc: gvc,
                                                                                                                    height: 300,
                                                                                                                    initial: data.class,
                                                                                                                    title: ``,
                                                                                                                    callback: (text) => {
                                                                                                                        data.class = text
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        })()
                                                                                                    ].join('')
                                                                                                },
                                                                                                divCreate: {
                                                                                                    class:` rounded-3 px-3 mt-2 py-1 `,style:`border:1px solid black;`
                                                                                                }
                                                                                            }
                                                                                        }),
                                                                                        gvc.bindView(() => {
                                                                                            const id = glitter.getUUID()
                                                                                            data.dataType = data.dataType ?? "static"
                                                                                            return {
                                                                                                bind: id,
                                                                                                view: () => {
                                                                                                    return [
                                                                                                        `<h3 style="color: black;font-size: 24px;margin-bottom: 10px;" class="fw-bold mt-2">STYLE參數</h3>`,
                                                                                                        EditorElem.select({
                                                                                                            title: "設定參數資料來源",
                                                                                                            gvc: gvc,
                                                                                                            def: data.dataType,
                                                                                                            array: [
                                                                                                                {
                                                                                                                    title: '靜態來源',
                                                                                                                    value: 'static'
                                                                                                                },
                                                                                                                {
                                                                                                                    title: '程式碼',
                                                                                                                    value: 'code'
                                                                                                                }
                                                                                                            ],
                                                                                                            callback: (text) => {
                                                                                                                data.dataType = text
                                                                                                                gvc.notifyDataChange(id)
                                                                                                            }
                                                                                                        }),
                                                                                                        `<div class="mt-2"></div>`,
                                                                                                        (()=>{
                                                                                                            if(data.dataType==='static'){
                                                                                                                return EditorElem.styleEditor({
                                                                                                                    gvc: gvc,
                                                                                                                    height: 300,
                                                                                                                    initial: data.style,
                                                                                                                    title: ``,
                                                                                                                    callback: (text) => {
                                                                                                                        data.style = text
                                                                                                                    }
                                                                                                                })
                                                                                                            }else{
                                                                                                                return EditorElem.codeEditor({
                                                                                                                    gvc: gvc,
                                                                                                                    height: 300,
                                                                                                                    initial: data.style,
                                                                                                                    title: ``,
                                                                                                                    callback: (text) => {
                                                                                                                        data.style = text
                                                                                                                    }
                                                                                                                })
                                                                                                            }
                                                                                                        })()    
                                                                                                    ].join('')
                                                                                                },
                                                                                                divCreate: {
                                                                                                    class:` rounded-3 px-3 mt-2 py-1 `,style:`border:1px solid black;`
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    ].join('')
                                                                                }

                                                                                return html`
                                                                                    <div class="mx-2">
                                                                                        ${EditorElem.editerDialog({
                                                                                            gvc: gvc,
                                                                                            dialog: (gvc: GVC) => {
                                                                                                return editIt(gvc, styleData)
                                                                                            },
                                                                                            width: '600px',
                                                                                            editTitle: `裝置預設樣式`
                                                                                        })}
                                                                                    </div>
                                                                                    <div class="my-2 w-100">
                                                                                        ${EditorElem.arrayItem({
                                                                                            gvc: gvc,
                                                                                            title: '設定其他裝置尺寸',
                                                                                            array: () => {
                                                                                                return styleData.stylist.map((dd) => {
                                                                                                    return {
                                                                                                        title: `寬度:${dd.size}`,
                                                                                                        innerHtml: () => {
                                                                                                            return EditorElem.editeInput({
                                                                                                                gvc: gvc,
                                                                                                                title: '設定寬度尺寸',
                                                                                                                default: `${dd.size}`,
                                                                                                                placeHolder: '請輸入Class參數',
                                                                                                                callback: (text) => {
                                                                                                                    dd.size = text
                                                                                                                    gvc.recreateView()
                                                                                                                },
                                                                                                                type: 'text'
                                                                                                            }) + editIt(gvc, dd)
                                                                                                        },
                                                                                                        width: '600px'
                                                                                                    }
                                                                                                })
                                                                                            },
                                                                                            originalArray: styleData.stylist,
                                                                                            expand: {},
                                                                                            plus: {
                                                                                                title: "新增尺寸",
                                                                                                event: gvc.event(() => {
                                                                                                    styleData.stylist.push({
                                                                                                        size: 480,
                                                                                                        style: ``,
                                                                                                        class: ``
                                                                                                    })
                                                                                                    gvc.recreateView()
                                                                                                })
                                                                                            },
                                                                                            refreshComponent: () => {
                                                                                                gvc.recreateView()
                                                                                            }
                                                                                        })}
                                                                                    </div>`
                                                                            } else {
                                                                                return ``
                                                                            }
                                                                        })()
                                                                    ].join('<div class="my-2"></div>')
                                                                },
                                                                divCreate: {
                                                                    class: ``,
                                                                    style: `max-height:calc(90vh - 150px);overflow-y:auto;`
                                                                }
                                                            }
                                                        })}
                                                    </div>
                                                </div>`
                                        },
                                        divCreate: {
                                            style: `overflow-y:auto;`
                                        },
                                        onCreate: () => {

                                        }
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    }
})


// init((gvc, glitter, gBundle) => {
//     const option=gBundle.option ?? {}
//     const design: {
//         style: string,
//         class: string,
//         styleList: {
//             tag?: string,
//             data:  { [name: string]:string }
//         }[]
//     } = {
//         get style() {
//             return gBundle.data.style;
//         },
//         set style(data){
//             gBundle.data.style=data
//         },
//         get class() {
//             return gBundle.data.class;
//         },
//         set class(data){
//             gBundle.data.class=data
//         },
//         get styleList(){
//             gBundle.data.styleList=gBundle.data.styleList ??[]
//             return gBundle.data.styleList
//         },
//         set styleList(data){
//             gBundle.data.styleLis=data
//         }
//     }
//
//     return {
//         onCreateView: () => {
//             const styleContainer = glitter.getUUID()
//             return `
//             <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.3);" >
//             <div class="bg-light m-auto rounded shadow" style="max-width: 100%;max-height: 100%;width: 480px;overflow-y: scroll;">
//         <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
//         <h3 class="modal-title fs-4" >設計樣式</h3>
//         <i class="fa-solid fa-xmark text-dark position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
//         onclick="${gvc.event(() => {
//                 glitter.closeDiaLog(gvc.parameter.pageConfig?.tag)
//             })}"></i>
// </div>
// <div class="w-100 p-3">
// ${(()=>{
//                 return [
//                     `<div class="${(!option.writeOnly||option.writeOnly.indexOf('class')!==-1) ? ``:`d-none`}">${glitter.htmlGenerate.editeText({
//                         gvc: gvc,
//                         title: 'Class參數',
//                         default: design.class,
//                         placeHolder: `請輸入Class樣式或程式碼\n譬如:
//         -(()=>{
//         const a=true
//         if(abc){
//         return 'text-dark'
//         }else{
//          return 'text-white'
//         }
//         })()．`,
//                         callback: (text) => {
//                             design.class = text
//                         }
//                     })}</div>`,
//                     `<div class="${(!option.writeOnly||option.writeOnly.indexOf('style')!==-1) ? ``:`d-none`}">${  glitter.htmlGenerate.editeText({
//                         gvc: gvc,
//                         title: `Style樣式`,
//                         default: design.style,
//                         placeHolder: `輸入Style樣式或者程式碼\n譬如:
//         -(()=>{ const a=true
//         if(abc){
//         return 'color:red;font-size:20px;'
//         }else{
//          return 'color:red;'
//         }})()`,
//                         callback: (text) => {
//                             design.style = text
//                         }
//                     })}</div>`,
//              `
// ${gvc.bindView(() => {
//                  const idl = glitter.getUUID()
//                  return {
//                      bind: idl,
//                      view: () => {
//                          return `${EditorElem.h3("設計特徵")}<div class="alert-success alert ">
// ${design.styleList.map((dd, index) => {
//                              let title = (styleAttr.find((d2) => {
//                                  return dd.tag === d2.tag
//                              }) ?? {}).title ?? "尚未設定";
//                              return `
//     ${EditorElem.toggleExpand({
//                                  gvc: gvc, title: EditorElem.minusTitle(title, gvc.event(() => {
//                                      design.styleList.splice(index, 1)
//                                      gvc.notifyDataChange(idl)
//                                  })), data: dd, innerText: (() => {
//                                      return `
// <div class="mb-2">
// </div>
// <div class="btn-group dropdown w-100" style="">
//   ${(() => {
//                                          let title = (styleAttr.find((d2) => {
//                                              return dd.tag === d2.tag
//                                          }) ?? {}).title ?? "";
//                                          const id = glitter.getUUID()
//                                          const id2 = glitter.getUUID()
//
//                                          return `
// ${gvc.bindView(() => {
//                                              return {
//                                                  bind: id2,
//                                                  view: () => {
//                                                      return `<input class="form-control w-100" style="height: 40px;" placeholder="關鍵字搜尋" onfocus="${gvc.event(() => {
//                                                          $('#' + gvc.id(id)).addClass(`show`)
//                                                      })}" onblur="${gvc.event(() => {
//                                                          setTimeout(() => {
//                                                              $('#' + gvc.id(id)).removeClass(`show`)
//                                                          }, 300)
//                                                      })}" oninput="${gvc.event((e) => {
//                                                          title = e.value
//                                                          dd.tag = (styleAttr.find((d2) => {
//                                                              return d2.title == e.value
//                                                          }) ?? {}).tag
//                                                          gvc.notifyDataChange(styleContainer)
//                                                          gvc.notifyDataChange(id)
//                                                      })}" value="${title}">`
//                                                  },
//                                                  divCreate: {class: `w-100`}
//                                              }
//                                          })}
// ${gvc.bindView(() => {
//                                              return {
//                                                  bind: id,
//                                                  view: () => {
//                                                      return styleAttr.filter((d2) => {
//                                                          return d2.title.indexOf(title) !== -1
//                                                      }).map((d3) => {
//                                                          return `<button  class="dropdown-item" onclick="${gvc.event(() => {
//                                                              dd.tag = d3.tag
//                                                              title = d3.title
//                                                              gvc.notifyDataChange(idl)
//                                                          })}">${d3.title}</button>`
//                                                      }).join('')
//                                                  },
//                                                  divCreate: {
//                                                      class: `dropdown-menu`,
//                                                      style: `transform: translateY(40px);max-height: 200px;overflow-y:scroll;`
//                                                  }
//                                              }
//                                          })}
//                                             `
//                                      })()}
// </div>
// ${gvc.bindView(() => {
//                                          return {
//                                              bind: styleContainer,
//                                              view: () => {
//                                                  let data = (styleAttr.find((d2) => {
//                                                      return dd.tag === d2.tag
//                                                  }))
//                                                  if (data) {
//                                                      return data!.innerHtml(gvc, dd.data)
//                                                  } else {
//                                                      return ``
//                                                  }
//                                              },
//                                              divCreate: {}
//                                          }
//                                      })}
// `
//                                  })
//                              })}`
//                          }).join('<div class="my-2"></div>')}
// ${EditorElem.plusBtn("添加特徵", gvc.event((e, event) => {
//                              design.styleList.push({
//                                  tag: "",
//                                  data: {}
//                              })
//                              gvc.notifyDataChange(idl)
//                          }))}
// </div>`
//                      },
//                      divCreate: {class:(!option.writeOnly||option.writeOnly.indexOf('attr')!==-1) ? ``:`d-none`}
//                  }
//              })}`
//                 ].join('')
//             })()}
// ${gvc.map([
//                 `
//                 <button class="w-100 btn btn-primary mt-2" onclick="${gvc.event(() => {
//                     gBundle.callback()
//                     glitter.closeDiaLog(gvc.parameter.pageConfig?.tag)
//                 })}">
//                 儲存
// </button>
// `
//             ])}
// </div>
//
// </div>
// </div>
//             `;
//         }
//     };
// });

