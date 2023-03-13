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
                divCreate: {}
            });

        }
    };
});

