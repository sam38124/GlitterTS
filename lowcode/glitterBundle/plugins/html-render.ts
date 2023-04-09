import {init} from '../GVController.js';
import {TriggerEvent} from "./trigger-event.js";

init((gvc, glitter, gBundle) => {
    glitter.share.htmlExtension = glitter.share.htmlExtension ?? {};
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
                }catch (e){}
            }
        }
    })
    return {
        onCreateView: () => {
            return gvc.bindView({
                bind: 'main',
                view: () => {
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

