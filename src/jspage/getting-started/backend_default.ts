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
                title: 'Backend Server',
                subTitle: 'Support node.js with express framework ',
            };

            const sessions: { id: string; title: string; html: string }[] = [
                {
                    id: `Default`,
                    title: 'Default',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2"> Use default config for express server in backend_default dir．</h2>
   <img src="img/auto_backend.png" class="rounded-3 " style="max-width: 100%; width: 600px;" />
</section>`;
                    },
                }
            ];

            return doc.create(
                /*html*/ `
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4">
                        <div
                            class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2"
                        >
                            <div class="me-4">
                                <h1 class="pb-1">${topTitle.title}</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">${topTitle.subTitle}</h2>
                                <div class="m-3">
                                    <img src="img/express.jpeg" class="rounded-3 " style="max-width: 100%;" />
                                </div>
                            </div>
                        </div>
                        ${(() => {
                    let html = '';
                    sessions.map((dd) => (html += dd.html));
                    return html;
                })()}
                    </div>
                `,
                doc.asideScroller(sessions),
                new Items("Default server", gvc)
            );
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
