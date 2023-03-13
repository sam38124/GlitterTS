(() => {
    const glitter = (window as any).glitter

    interface HtmlJson {
        route: string,
        type: string,
        id: string,
        label: string,
        data: any,
        js: string,
        class?: string,
        style?: string,
        refreshAll?: () => void,
        refreshComponent?: () => void,
        refreshComponentParameter?: { view1: () => void, view2: () => void }
        refreshAllParameter?: { view1: () => void, view2: () => void }
    }

    glitter.share.htmlExtension["Glitter"] = {
        /*****Layout*****/
        container: (gvc: any, widget: HtmlJson, setting: HtmlJson[]) => {
            const htmlGenerate = new glitter.htmlGenerate(widget.data.setting);
            return {
                view: htmlGenerate.render(gvc, {class:`${widget.data.layout} ${widget.data.class}`,style:`${widget.data.style}`}),
                editor: (() => {
                    return gvc.map([
                        `<div class="my-2"></div>
<span class="w-100 mb-2 fw-500 mt-2 " style="color: orange;">排版方式</span>
<select class="form-select mt-2" onchange="${gvc.event((e:any) => {
                            widget.data.layout=e.value
                            widget.refreshAll!()
                        })}" >
${(() => {
                            const data = [
                                {tit: "d-block", value: `d-block`},
                                {tit: "d-inline-block", value: `d-inline-block`},
                                {tit: "d-inline-flex", value: `d-inline-flex`},
                                {tit: "d-flex", value: `d-flex`},
                                {tit: "row", value: `row`},
                            ]

                            return gvc.map(data.map((it) => {
                                return `<option value="${it.value}" ${(widget.data.layout === it.value) ? `selected`:``} >${it.tit}</option>`
                            }))
                        })()}
</select>
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.class=e.value
                            widget.refreshAll!()
                        })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                            widget.data.style=e.value
                            widget.refreshAll!()
                        })}">
`, (() => {
                            if (widget.data.setting.length > 0) {
                                return htmlGenerate.editor(gvc, {
                                    return_: true,
                                    refreshAll: widget.refreshAll!
                                })
                            } else {
                                return ``
                            }
                        })()
                    ])

                })()
            }
        }
        /************/
        ,image:(gvc: any, widget: HtmlJson, setting: HtmlJson[])=>{
            return {
                view:` <img class="w-100 ${widget.data.layout} ${widget.data.class}" style="${widget.data.style}" src="${widget.data.link ?? `https://oursbride.com/wp-content/uploads/2018/06/no-image.jpg`}"
 >`,
                editor:`
<h3 style="color: white;font-size: 16px;margin-bottom: 10px;" class="mt-2">圖片連結</h3>
<div class="mt-2"></div>
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Class</span>
<input class="form-control" value="${widget.data.class ?? ""}" onchange="${gvc.event((e:any)=>{
                    widget.data.class=e.value
                    widget.refreshAll!()
                })}">
<span class="w-100 mb-2 fw-500 mt-2" style="color: orange;">Style</span>
<input class="form-control" value="${widget.data.style ?? ""}" onchange="${gvc.event((e:any)=>{
                    widget.data.style=e.value
                    widget.refreshAll!()
                })}">
<div class="mt-2"></div>
<input class="flex-fill form-control " placeholder="請輸入圖片連結" value="${widget.data.link ?? ""}" onchange="${gvc.event((e:any)=>{
                    widget.data.link=e.value
                    widget.refreshAll!()
                })}">
                `
            }
        }
    };
})()

