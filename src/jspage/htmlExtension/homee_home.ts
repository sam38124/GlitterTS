(() => {
    const glitter = (window as any).glitter

    interface HtmlJson {
        rout: string,
        type: string,
        id: string,
        label: string,
        data: any,
        js: string,
        refreshAll: () => void,
        refreshComponent: () => void
    }

    glitter.share.htmlExtension["homee_home"] = {
        //橫幅
        banner: (gvc: any, widget: HtmlJson, setting: HtmlJson[]) => {
            const data: { link: { img: string }[] } = widget.data

            function slideControl(pageImgArray: any, pagination: boolean, navigation: boolean, scrollbar: boolean) {
                const glitter = gvc.glitter
                gvc.addStyle(`
            .swiper-slide{
                width: 100%;
                background-repeat: no-repeat;
            }
        `)
                let slidePage = ``
                pageImgArray.forEach((item: any, index: number) => {
                    // <!-- Slides -->
                    slidePage += `
                <div class="swiper-slide" style="padding-bottom: 128%; background:50% / cover url(${item.img});" onclick="${gvc.event(() => {
                        item.click()
                    })}">
                </div>
            `
                })
                let id = `${glitter.getUUID()}`
                return `
            <!-- Slider main container -->
            ${gvc.bindView({
                    bind: id,
                    view: () => {
                        return `
              <div class="swiper-wrapper">
                  ${slidePage}
              </div>
              <!-- If we need pagination -->

              ${(() => {
                            if (pagination) {
                                return `<div class="swiper-pagination"></div>`
                            } else {
                                return ``
                            }
                        })()}

              <!-- If we need navigation buttons -->
              ${(() => {
                            if (navigation) {
                                return `
                          <div class="swiper-button-prev"></div>
                          <div class="swiper-button-next"></div>`
                            } else {
                                return ''
                            }
                        })()}


              <!-- If we need scrollbar -->
              ${(() => {
                            if (scrollbar) {
                                return `<div class="swiper-scrollbar"></div>`
                            } else {
                                return ``
                            }

                        })()}

              `
                    },
                    divCreate: {class: `swiper ${id}`},
                    onCreate: () => {
                        gvc.addMtScript([{
                            src: 'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js'
                        }], () => {
                            const Swiper = (window as any).Swiper
                            const swiper = new Swiper(`.${id}`, {
                                // Optional parameters
                                direction: 'horizontal',
                                loop: true,

                                // If we need pagination
                                pagination: {
                                    el: `.${id} .swiper-pagination`,
                                },

                                // Navigation arrows
                                navigation: {
                                    nextEl: `.${id} .swiper-button-next`,
                                    prevEl: `.${id} .swiper-button-prev`,
                                },

                                // And if we need scrollbar
                                scrollbar: {
                                    el: `.${id} .swiper-scrollbar`,
                                },


                            });
                        })
                    }
                })}
        `;
            }

            gvc.addStyle(`
            .swiper-pagination-bullet{
            background-color: black !important;
            }
              .swiper-pagination-bullet-active{
            width:8px !important;
            background-color: white  !important;
            }
            `)
            gvc.addStyleLink(`https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css`)
            const editorID = glitter.getUUID()
            return {
                view: slideControl(data.link, true, false, false),
                editor: gvc.bindView({
                    bind: editorID,
                    view: () => {
                        function swapArr(arr: any[], index1: number, index2: number) {
                            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                            return arr;
                        }

                        return `
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
${gvc.map(data.link.map((dd, index) => {
                            return `<div class="d-flex align-items-center mb-3">
<i class="fa-regular fa-circle-minus text-danger me-2" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                data.link.splice(index, 1)
                                widget.refreshAll()
                            })}"></i>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${dd.img}">
<div class="d-flex flex-column mx-2">
<i class="fa-duotone fa-up  text-white ${(index === 0) ? `d-none` : ``}"  style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                data.link = swapArr(data.link, index, index - 1)
                                widget.refreshAll()
                            })}"></i>
<i class="fa-regular fa-down  text-white ${(index === data.link.length - 1) ? `d-none` : ``}" style="font-size: 20px;cursor: pointer;" onclick="${gvc.event(() => {
                                data.link = swapArr(data.link, index, index + 1)
                                widget.refreshAll()
                            })}"></i>
</div>
</div>`
                        }))}
<div class="text-white align-items-center justify-content-center d-flex p-1 rounded" style="border: 2px dashed white;" onclick="${
                            gvc.event(() => {
                                data.link.push({img: `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`})
                                widget.refreshAll()
                            })
                        }">添加輪播圖</div>
`
                    },
                    divCreate: {}
                })
            }
        },
        //廣告
        advertise1: (gvc: any, widget: HtmlJson, setting: HtmlJson[]) => {
            return {
                view: `<div class="d-flex flex-wrap w-100 justify-content-around">
<div class=" bg-dark" style="width: 184px;height: 266px;"></div>
<div class=" bg-dark" style="width: 120px;height: 50px;"></div>
<div class=" bg-dark" style="width: 50px;height: 50px;"></div>
</div>`,
                editor: ``
            }
        },
        //黑色星期五專區
        rankingBlock: (gvc: any, widget: HtmlJson, setting: HtmlJson[]) => {
            widget.data.titleStyle= widget.data.titleStyle ?? `font-family: 'Noto Sans TC';
font-style: normal;
color: black;
font-size: 16px;
margin-top: 16px;
margin-left: 12px;
font-weight: 700;`
            return {
                view: `
                <div class="" style="background-color: ${widget.data.bgcolor};border-radius:${widget.data.radius}px;">
                <h3 style="${widget.data.titleStyle}">黑色星期五</h3>
</div>
                `,
                editor: gvc.map([
                    glitter.htmlGenerate.editeInput({
                        gvc: gvc, title: "背景顏色", default: widget.data.bgcolor, placeHolder: "請輸入背景顏色", callback: (text:string) => {
                            widget.data.bgcolor=text
                            widget.refreshAll()
                        }
                    }),
                    glitter.htmlGenerate.editeInput({
                        gvc: gvc, title: "倒圓角", default: widget.data.radius, placeHolder: "請輸入圓角幅度", callback: (text:string) => {
                            widget.data.radius=text
                            widget.refreshAll()
                        }
                    }),
                    glitter.htmlGenerate.editeText({
                        gvc: gvc, title: "標題Style", default: widget.data.titleStyle , placeHolder: "請輸入標題Style", callback: (text:string) => {
                            widget.data.titleStyle=text
                            widget.refreshAll()
                        }
                    })
                ])
            }
        }
    };
})()