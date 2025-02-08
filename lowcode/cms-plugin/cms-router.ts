import {GVC} from "../glitterBundle/GVController.js";
import {BgWidget} from "../backend-manager/bg-widget.js";

export class CmsRouter{
    public static main(gvc:GVC){
        // alert(gvc.glitter.getUrlParameter('page'))
       return gvc.bindView(()=>{
           const id=gvc.glitter.getUUID()
           return {
               bind:id,
               view:()=>{return ``},
               divCreate:{
                   class:`${id}`,
               },
               onCreate:()=>{
                   new Promise((resolve, reject)=>{
                       switch (gvc.glitter.getUrlParameter('page')){
                           case 'blog_tag_setting':
                               gvc.glitter.getModule(new URL('./backend-manager/bg-blog.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.setCollection({
                                       gvc: gvc,
                                       key: 'blog_collection'
                                   }))
                               });

                               break
                           case 'blog_global_setting':
                               gvc.glitter.getModule(new URL('./cms-plugin/seo-blog.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.main(gvc))
                               });
                               break
                           default:
                               resolve('no page')
                       }
                   }).then((dd:any)=>{
                       (document.querySelector(`.${id}`) as any).outerHTML=`<div class="vw-100 py-3" style="background-color: #f5f5f5 !important;min-height: 100vh;">
${BgWidget.container(dd,{})}
</div>`
                   })
               }
           }
       })
    }
}

(window as any).glitter.setModule(import.meta.url,CmsRouter)