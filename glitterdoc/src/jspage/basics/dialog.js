import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';
init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const topTitle = {
                title: 'Dialog',
                subTitle: 'You can use dialog to show LoadingView,InfoView,ErrorView or other pop-up windows． ',
            };
            const sessions = [
                {
                    id: 'Open',
                    title: 'Open',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Use glitter.openDiaLog to show dialog.</h2>
                            ${doc.codePlace(`glitter.openDiaLog('dialog/myDialog.js','myDialog',{})`, 'language-typescript')}
                             <h2 class="fs-lg mb-2 fw-normal fw-500 mt-2">With animation.</h2>
                             ${doc.codePlace(`glitter.openDiaLog('dialog/myDialog.js','myDialog',{},{animation:glitter.animation.fade})`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'Close',
                    title: 'Close Dialog',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">Use glitter.closeDiaLog to close dialog</h2>
                             ${doc.codePlace(`//Close all dialog
glitter.closeDiaLog()
//Close dialog with tag name
glitter.closeDiaLog('tagName')`, 'language-typescript')}
                        </section>`;
                    },
                },
            ];
            return doc.create(`
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4">
                        <div
                            class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2"
                        >
                            <div class="me-4">
                                <h1 class="pb-1">${topTitle.title}</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">${topTitle.subTitle}</h2>
                            </div>
                        </div>
                        ${(() => {
                let html = '';
                sessions.map((dd) => (html += dd.html));
                return html;
            })()}
                    </div>
                `, doc.asideScroller(sessions), new Items(topTitle.title, gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
