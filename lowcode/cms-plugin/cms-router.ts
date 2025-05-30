import {GVC} from "../glitterBundle/GVController.js";
import {BgWidget} from "../backend-manager/bg-widget.js";

export class CmsRouter{
    public static main(gvc:GVC){
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
                           case 'fb_live':
                           case 'ig_live':
                           case 'line_plus':
                               resolve(`<div class="d-flex w-100 align-items-center justify-content-center">
<div class="insignia insignia-warning">功能優化中，預計於6月1號重新開放!</div>
</div>`)
                               break
                           // case 'fb_live':
                           //     gvc.glitter.getModule(new URL('./cms-plugin/live_capture.js', gvc.glitter.root_path).href, (cl) => {
                           //         resolve(cl.main(gvc,false))
                           //     });
                           //     break
                           // case 'ig_live':
                           // case 'line_plus':
                           //     gvc.glitter.getModule(new URL('./cms-plugin/live_capture.js', gvc.glitter.root_path).href, (cl) => {
                           //         resolve(cl.main(gvc,true))
                           //     });
                           //     break
                           case 'shipment_list':
                           case 'shipment_list_archive':
                               gvc.glitter.getModule(new URL('./cms-plugin/shopping-order-manager.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.main(gvc,{
                                       isShipment:true,
                                       isArchived:gvc.glitter.getUrlParameter('page')==='shipment_list_archive'
                                   }))
                               });
                               break
                           case 'reconciliation_area':
                               gvc.glitter.getModule(new URL('./cms-plugin/reconciliation-area.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.main(gvc))
                               })
                               break
                           case 'app-design':
                               gvc.glitter.getModule(new URL('./cms-plugin/app-design.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.main(gvc))
                               })
                               break
                           case 'pos_setting':
                               gvc.glitter.getModule(new URL('./cms-plugin/pos-config-setting.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.main(gvc))
                               })
                               break
                           case 'auto_fcm_push':
                               gvc.glitter.getModule(new URL('./cms-plugin/auto-fcm-push.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.main(gvc))
                               })
                               break
                           case 'auto_fcm_history':
                               // resolve('12345')
                               gvc.glitter.getModule(new URL('./cms-plugin/auto-fcm-history.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.emailHistory(gvc))
                               })
                               break
                           case 'auto_fcm_advertise':
                               gvc.glitter.getModule(new URL('./cms-plugin/auto-fcm-advertise.js', gvc.glitter.root_path).href, (cl) => {
                                   resolve(cl.main(gvc))
                               })
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