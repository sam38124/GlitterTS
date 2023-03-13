import { init } from '../GVController.js';
init((gvc, glitter, gBundle) => {
    var _a;
    glitter.share.htmlExtension = (_a = glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
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
