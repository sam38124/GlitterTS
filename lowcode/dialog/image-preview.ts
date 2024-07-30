import { init } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';

init(import.meta.url, (gvc, glitter, gBundle) => {
    glitter.addMtScript(
        [{ src: `https://kit.fontawesome.com/02e2dc09e3.js` }],
        () => {},
        () => {}
    );
    return {
        onCreateView: () => {
            const id = glitter.getUUID();
            const hd = glitter.getUUID();
            const html = String.raw;
            return html`<div class="vw-100 vh-100 d-flex align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);">
                <div id="${hd}" style="height:50px;right:0;top:0;" class="m-2 position-absolute d-flex align-items-center justify-content-center gap-2">
                    ${BgWidget.grayButton(
                        '列印',
                        gvc.event(() => {
                            $('#' + hd).addClass('d-none');
                            window.print();
                            $('#' + hd).removeClass('d-none');
                        })
                    )}
                    ${BgWidget.grayButton(
                        '關閉',
                        gvc.event(() => {
                            gvc.closeDialog();
                        })
                    )}
                </div>
                <div id="${id}" style="max-width: 100%;max-height: 100%;">
                    <img style="max-width: 85vw;max-height: 85vh;" src="${gBundle}" />
                </div>
            </div>`;
        },
    };
});
