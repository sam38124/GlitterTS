import {init} from '../GVController.js';
import {TriggerEvent} from "./trigger-event.js";

init((gvc, glitter, gBundle) => {
    glitter.share.htmlExtension = glitter.share.htmlExtension ?? {};
    const vm={
        loading:true
    };
    async function load(){
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



    load().then(()=>{
        vm.loading=false
        gvc.notifyDataChange('main')
    })
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: 'main',
                view: () => {
                    if(vm.loading){
                        return ``
                    }
                    return (gBundle.editMode && gBundle.editMode.render(gvc))
                        ||
                        new glitter.htmlGenerate(gBundle.config, []).render(gvc);
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

