import {GVC} from "../../glitterBundle/GVController.js";
import {Color} from "../public/color.js";

const html = String.raw

export class BannerSy01 {
    public static main(obj: {
        gvc: GVC,
        widget: any,
        subData: any
    }) {
        const widget = obj.widget;
        const pb = widget.formData.ratio.split(':').map((dd: any) => {
            return parseInt(dd, 10)
        });
if(typeof widget.formData.back_img==='object'){
    widget.formData.back_img=widget.formData.back_img.value
}
        const colors = Color.getThemeColors(obj.gvc, widget.formData.theme_color);
        return `<div class="w-100  position-relative" style="padding-bottom: ${(pb[1] / pb[0] * 100).toFixed(0)}%;background-image: url('${widget.formData.back_img}');background-position: center;background-size: cover;">
<div class="position-absolute w-100 h-100 " style="background: ${widget.formData.cover_color};"></div>
<div class="position-absolute w-100 h-100 d-flex align-items-center" style="position: relative;z-index: 2;${document.body.clientWidth < 800 ? `padding: 20px;`:`padding-left: 150px;`}">
<div class="d-flex flex-column position-relative" style="gap:12px;width: 623px;max-width: 100%;">
<div style=" font-size: ${widget.formData["title-size"]}px; font-weight: 700;  word-wrap: break-word;color:${colors.title};">${widget.formData.title.replace(/\n/g, '<br>')}</div>
<div style="font-size: ${widget.formData["sub-title-size"]}px; font-weight: 400; word-wrap: break-word;color:${colors.content};">${widget.formData.sub_title.replace(/\n/g, '<br>')}</div>
<div class="d-flex align-items-center mt-2 justify-content-center rounded-3 bg-white p-2" style="max-width: 100%;">
<input class="form-control flex-fill " style="border-style: none;" placeholder="${widget.formData.hint || '我想要尋找...'}">
<div class="position-relative d-flex align-items-center px-2 py-1 rounded-2 justify-content-center" style="cursor: pointer;background: ${colors.soild};color: ${colors.soild_text};width: 60px;height: 44px;">
<i class="fa-solid fa-magnifying-glass"></i>
</div>
</div>
<div class="d-flex flex-wrap mt-3" style="gap:10px;">
${widget.formData.search_tag.map((dd: any) => {
            return html`
                <div style="border: 1px solid ${colors.border_bg};display: flex;
color: ${colors.border_text};
height: 40px;
justify-content: center;
align-items: center;
gap: 10px;border-radius: 30px;cursor: pointer;" class="d-flex align-items-center px-3 px-sm-3 px-2" onclick="${obj.gvc.event(()=>{
    obj.gvc.glitter.href=`/all-product?search=${dd.title}`
                })}">
                    ${dd.title}
                </div>`
        }).join('')}

</div>
</div>
</div>
<div></div>
</div>`
    }
}

(window as any).glitter.setModule(import.meta.url, BannerSy01);