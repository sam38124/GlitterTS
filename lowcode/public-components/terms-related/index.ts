import {GVC} from "../../glitterBundle/GVController.js";
import {ApiUser} from "../../glitter-base/route/user.js";
import {Language} from "../../glitter-base/global/language.js";

const html = String.raw

export class TermsRelated {
    static main(obj: {
        gvc: GVC,
        widget: any,
        subData: any
    }) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const title_color = glitter.share.globalValue['theme_color.0.title']
        const page = glitter.getUrlParameter('page')
        return gvc.bindView(() => {
            return {
                bind: glitter.getUUID(),
                view: async () => {
                    //分類頁面
                    if ((`${glitter.getUrlParameter('page')}`.startsWith(`collections`)) ||
                        (`${glitter.getUrlParameter('page')}`.startsWith(`all-product`))
                    ) {
                        return await new Promise((resolve, reject) => {
                            glitter.getModule(new URL('./public-components/product/product-list.js', gvc.glitter.root_path).href, (res) => {
                                resolve(res.main(gvc));
                            });
                        })
                    } else {
                        //條款頁面
                        let lan_d = (await ApiUser.getPublicConfig(`terms-related-${page}-${Language.getLanguage()}`, 'manager')).response.value.text
                        if (!lan_d) {
                            lan_d = (await ApiUser.getPublicConfig(`terms-related-${page}-${(window as any).store_info.language_setting.def}`, 'manager')).response.value.text
                        }
                        return html`<h1 class="my-sm-5 my-4 fs-1" style="color:${title_color};">服務條款</h1>
                        <div class="mb-5" style="min-height: calc(100vh - 200px);">
                            ${lan_d || ''}
                        </div>`
                    }

                },
                divCreate: {
                    class: `container text-center`
                }
            }
        })
    }
}

(window as any).glitter.setModule(import.meta.url, TermsRelated);

