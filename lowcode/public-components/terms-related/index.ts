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
        const id=glitter.getUUID()
        const page = glitter.getUrlParameter('page')
        return gvc.bindView(() => {
            return {
                bind: id,
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
                    } else if (
                        [ 'blogs','pages','shop','hidden'].find((dd)=>{
                          return  (`${glitter.getUrlParameter('page')}`.startsWith(dd))
                        }) && (`${glitter.getUrlParameter('page')}`.split('/')[1])) {
                        return await new Promise((resolve, reject) => {
                            glitter.getModule(new URL('./public-components/blogs/blogs-01.js', gvc.glitter.root_path).href, (res) => {
                                resolve(res.getMain(obj.gvc));
                            });
                        })
                    }else if ((`${glitter.getUrlParameter('page')}`.startsWith(`blogs`))) {
                        return await new Promise((resolve, reject) => {
                            glitter.getModule(new URL('./public-components/blogs/list.js', gvc.glitter.root_path).href, (res) => {
                                resolve(res.main(obj));
                            });
                        })
                    }else if ((`${glitter.getUrlParameter('page')}`.startsWith(`products/`))) {
                        return await new Promise((resolve, reject) => {
                            glitter.getModule(new URL('./public-components/product/product-detail.js', gvc.glitter.root_path).href, (res) => {
                                (document.querySelector(`.${id}`) as any).outerHTML=res.main(gvc)
                            });
                        })
                    } else if(['blog_tag_setting','blog_global_setting','fb_live','ig_live','line_plus','shipment_list','shipment_list_archive'].includes(glitter.getUrlParameter('page'))){
                        return await new Promise((resolve, reject) => {
                            glitter.getModule(new URL('./cms-plugin/cms-router.js', gvc.glitter.root_path).href, (res) => {
                                (document.querySelector(`.${id}`) as any).outerHTML=res.main(gvc);
                            });
                        })
                    }else if (['checkout'].includes(page)){
                        return await new Promise((resolve, reject) => {
                            glitter.getModule(new URL('./public-components/checkout/index.js', gvc.glitter.root_path).href, (res) => {
                                (document.querySelector(`.${id}`) as any).outerHTML=res.main(gvc,obj.widget,obj.subData);
                            });
                        })
                    }else{
                        //條款頁面
                        let lan_d = (await ApiUser.getPublicConfig(`terms-related-${page}-${Language.getLanguage()}`, 'manager')).response.value.text
                        if (!lan_d) {
                            lan_d = (await ApiUser.getPublicConfig(`terms-related-${page}-${(window as any).store_info.language_setting.def}`, 'manager')).response.value.text
                        }
                        return html`
                            <div class="mb-5 mt-3" style="min-height: calc(100vh - 200px);">
                                ${lan_d || ''}
                            </div>`
                    }

                },
                divCreate: {
                    class: `container text-center ${id}`
                }
            }
        })
    }
}

(window as any).glitter.setModule(import.meta.url, TermsRelated);

