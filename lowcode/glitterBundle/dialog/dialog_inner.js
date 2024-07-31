import { init } from '../GVController.js';
init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            return gvc.bindView(() => {
                const id = glitter.getUUID();
                const data = gBundle.getView(gvc);
                const html = String.raw;
                let view = '';
                if (data.then) {
                    data.then((data) => {
                        view = data;
                        gvc.notifyDataChange(id);
                    });
                }
                else {
                    view = data;
                }
                return {
                    bind: id,
                    view: () => {
                        return html ` <div class="vw-100 vh-100 position-absolute" style="background: rgba(0,0,0,0.7); z-index: 0;"></div>
                            <div class="vw-100 vh-100 d-flex align-items-center justify-content-center position-relative" style="z-index: 1;">${view}</div>`;
                    },
                };
            });
        },
    };
});
