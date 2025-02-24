import { BgWidget } from "../backend-manager/bg-widget.js";
export class CmsRouter {
    static main(gvc) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => { return ``; },
                divCreate: {
                    class: `${id}`,
                },
                onCreate: () => {
                    new Promise((resolve, reject) => {
                        switch (gvc.glitter.getUrlParameter('page')) {
                            case 'blog_tag_setting':
                                gvc.glitter.getModule(new URL('./backend-manager/bg-blog.js', gvc.glitter.root_path).href, (cl) => {
                                    resolve(cl.setCollection({
                                        gvc: gvc,
                                        key: 'blog_collection'
                                    }));
                                });
                                break;
                            case 'blog_global_setting':
                                gvc.glitter.getModule(new URL('./cms-plugin/seo-blog.js', gvc.glitter.root_path).href, (cl) => {
                                    resolve(cl.main(gvc));
                                });
                                break;
                            case 'shopnex-line-oauth':
                                console.log("glitter.getUrlParameter('page') -- ", gvc.glitter.getUrlParameter('groupId'));
                                gvc.glitter.getModule(new URL('./cms-plugin/live_capture.js', gvc.glitter.root_path).href, (cl) => {
                                    resolve(cl.inputVerificationCode(gvc));
                                });
                                break;
                            default:
                                resolve('no page');
                        }
                    }).then((dd) => {
                        document.querySelector(`.${id}`).outerHTML = `<div class="vw-100 py-3" style="background-color: #f5f5f5 !important;min-height: 100vh;">
${BgWidget.container(dd, {})}
</div>`;
                    });
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, CmsRouter);
