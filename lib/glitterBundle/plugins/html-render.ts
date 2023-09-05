import {init} from '../GVController.js';
import {TriggerEvent} from "./trigger-event.js";

init((gvc, glitter, gBundle) => {
    glitter.share.htmlExtension = glitter.share.htmlExtension ?? {};
    gBundle.app_config=gBundle.app_config??{}
    gBundle.app_config.globalStyle=gBundle.app_config.globalStyle??[]
    gBundle.app_config.globalScript=gBundle.app_config.globalScript??[]

    const vm={
        loading:true
    };
    async function load(){
        await (new Promise(async (resolve, reject)=>{
            for (const b of gBundle.app_config.initialList ?? []){
                try {
                    await TriggerEvent.trigger({
                        gvc: gvc, widget: b as any, clickEvent: b.src.event
                    }).then(() => {
                        resolve(true)
                    }).catch(() => {
                        resolve(true)
                    })
                } catch (e) {
                    resolve(true)
                }
            }

        }));
        await (new Promise(async (resolve, reject)=>{
            (gBundle.page_config.initialList ?? []).map((dd:any)=>{
                if(dd.when==='initial'){
                    if(dd.type==='script'){
                        try {
                            TriggerEvent.trigger({
                                gvc:gvc,widget:(undefined as any),clickEvent:dd
                            })
                        }catch (e){}
                    }else{
                        try {
                            eval(dd.src.official)
                        }catch (e){

                        }
                    }
                }
            })
            resolve(true)
        }));
        (gBundle.page_config.initialStyleSheet ?? []).map(async (data:any)=>{
            if(data.type==='script'){
                try {
                    gvc.addStyleLink(data)
                }catch (e){}
            }else{
                try {
                gvc.addStyle(data.src.official)
                }catch (e){}
            }
        })
    };


    return {
        onCreateView: () => {
            return new glitter.htmlGenerate(gBundle.app_config.globalScript ?? [], [],undefined,true).render(gvc,{
                class:``,
                style:``,
                jsFinish:()=>{
                    load().then(()=>{
                        if(vm.loading){
                            vm.loading=false
                            gvc.notifyDataChange('main')
                        }

                    })
                }
            })+gvc.bindView({
                bind: 'main',
                view: () => {

                    if(vm.loading){
                        return ``
                    }

                    return new glitter.htmlGenerate(gBundle.app_config.globalStyle, [],undefined,true).render(gvc)+(
                        (gBundle.editMode && gBundle.editMode.render(gvc))
                        ||
                        new glitter.htmlGenerate(gBundle.config, [],undefined,true).render(gvc)
                    );
                },
                divCreate: {
                    class:glitter.htmlGenerate.styleEditor(gBundle.page_config).class(),style:`min-height: 100vh;min-width: 100vw;${glitter.htmlGenerate.styleEditor(gBundle.page_config).style()}`
                },
                onCreate:()=>{
                    (gBundle.page_config.initialList ?? []).map((dd:any)=>{
                        if(dd.when==='onCreate'){
                            try {
                                eval(dd.src.official)
                            }catch (e){}
                        }
                    })
                }
            });

        }
    };
});

