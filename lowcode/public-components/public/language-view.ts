import {Language} from "../../glitter-base/global/language.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {UmClass} from "../user-manager/um-class.js";
import {ShareDialog} from "../../dialog/ShareDialog.js";

export class LanguageView{
    public static selectLanguage(gvc:GVC,colors:any){
        return `   <div class="px-2 py-2 d-flex align-items-center mt-2 fw-500 fs-6" style="background: ${colors.soild};height:30px;color: ${colors.soild_text};border-radius: 15px;gap:10px;width:100px;cursor: pointer;"
   onclick="${gvc.event(()=>{
            UmClass.dialog({
                gvc,
                tag: 'user-qr-code',
                title: Language.text('switch_language'),
                innerHTML: (gvc) => {
                    return gvc.bindView(
                        (() => {
                            const id = gvc.glitter.getUUID();
                            const glitter=gvc.glitter
                            const html=String.raw
                            let img = '';
                            return {
                                bind: id,
                                view: () => {
                                    return html`<div style="position: relative;word-break: break-all;white-space: normal;">${gvc.bindView(() => {


                                        const html = String.raw
                                        const all_lan = ['en-US', 'zh-CN', 'zh-TW'];


                                        let select_language = ''
                                        return {
                                            bind: glitter.getUUID(),
                                            view: () => {

                                                const sup = [
                                                    {
                                                        key: 'en-US',
                                                        value: '英文'
                                                    },
                                                    {
                                                        key: 'zh-CN',
                                                        value: '簡體中文'
                                                    },
                                                    {
                                                        key: 'zh-TW',
                                                        value: '繁體中文'
                                                    }
                                                ].filter((dd) => {
                                                    return (window as any).store_info.language_setting.support.includes(dd.key)
                                                }).sort((dd: any) => {
                                                    return dd.key === (window as any).store_info.language_setting.def ? -1 : 1
                                                });

                                                return html`
                                <div class="d-flex mt-3 flex-wrap align-items-center justify-content-center" style="gap:15px;">
                                    ${sup.map((dd: any) => {
                                                    return html`
                                            <div class="px-3 py-1 text-white position-relative d-flex align-items-center justify-content-center"
                                                 style="border-radius: 20px;background: #393939;cursor: pointer;width:100px;"
                                                 onclick="${gvc.event(() => {
                                                        const dialog=new ShareDialog(glitter)
                                                        Language.setLanguage(dd.key);
                                                        dialog.dataLoading({visible:true})
                                                        location.href=`${glitter.root_path}${Language.getLanguageLinkPrefix()}${gvc.glitter.getUrlParameter('page')}${location.search}`
                                                    })}">${dd.value}
                                                <div class="position-absolute  text-white rounded-2 px-2 d-flex align-items-center rounded-3 ${dd.key !== Language.getLanguage() ? `d-none` : ``}"
                                                     style="top: -12px;right: -10px; height:20px;font-size: 11px;background: #ff6c02;">
                                                    已選擇
                                                </div>
                                            </div>
                                        `
                                                }).join('')}
                                </div>`
                                            }
                                        }
                                    })}</div>`;
                                },
                                divCreate: {},
                                onCreate: () => {
                                },
                            };
                        })()
                    );
                },
                width:400
            });
        })}">
 <i class="fa-duotone fa-solid fa-earth-americas"></i>       
<div class="fw-bold" style="font-size:13px;"> ${Language.getLanguageText(true)}    </div>                    
</div>`
    }
}