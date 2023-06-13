import {init} from '../GVController.js';

init((gvc, glitter, gBundle) => {
    glitter.share.htmlExtension = glitter.share.htmlExtension ?? {};
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
                }
            });

        }
    };
});

