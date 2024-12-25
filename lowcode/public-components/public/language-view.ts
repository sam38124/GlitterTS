import {Language} from '../../glitter-base/global/language.js';
import {GVC} from '../../glitterBundle/GVController.js';
import {UmClass} from '../user-manager/um-class.js';
import {ShareDialog} from '../../dialog/ShareDialog.js';

const html = String.raw;

export class LanguageView {
    public static selectLanguage(gvc: GVC, colors: any) {
        return html`
            <div class="btn-group dropdown">
                <div  class=" px-2 py-2 d-flex align-items-center mt-2 fw-500 fs-6" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false"
                style="background: ${colors.soild};height:30px;color: ${colors.soild_text};border-radius: 15px;gap:10px;width:100px;cursor: pointer;">
                    <i class="fa-duotone fa-solid fa-earth-americas"></i>
                   <span style="font-size:14px;"> ${Language.getLanguageText({
                       local: true
                   })}</span>
                </div>
                <div class="dropdown-menu dropdown-menu-end my-1">
                    ${[
                        {
                            key: 'en-US',
                            value: 'English',
                        },
                        {
                            key: 'zh-CN',
                            value: '简体中文',
                        },
                        {
                            key: 'zh-TW',
                            value: '繁體中文',
                        }
                    ]
                            .filter((dd) => {
                                return (window as any).store_info.language_setting.support.includes(dd.key);
                            })
                            .sort((dd: any) => {
                                return dd.key === (window as any).store_info.language_setting.def ? -1 : 1;
                            }).map((dd) => {
                                return `<a  class="dropdown-item" style="cursor: pointer;" onclick="${gvc.event(()=>{
                                    const dialog = new ShareDialog(gvc.glitter);
                                    Language.setLanguage(dd.key);
                                    dialog.dataLoading({visible: true});
                                    location.href = `${gvc.glitter.root_path}${Language.getLanguageLinkPrefix()}${gvc.glitter.getUrlParameter('page')}${
                                            location.search
                                    }`;
                                })}">${dd.value}</a>`
                            }).join('')}
                </div>
            </div>`
    }
}
