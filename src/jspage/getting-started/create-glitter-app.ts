import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';

init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const sessions: { id: string; title: string; html: string }[] = [
                {
                    id: `Step1`,
                    title: 'Step. 1',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2"> Create new project by create-ts-glitter.</h2>
${doc.codePlace('npx create-ts-glitter', 'language-cmd')}
</section>`;
                    },
                },
                {
                    id: `Finish`,
                    title: 'Finish',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-3">Open the index.html file.</h2>
<img src="img/create/index.png" class="rounded-3 " style="max-width: 100%;width: 500px;">
<h2 class="fs-lg  fw-normal fw-500 mb-2 mt-4">👍<span class="me-2"></span>Great job! Now you can start your coding.</h2>
</section>`;
                    },
                },
                {
                    id: `Guide`,
                    title: 'Guide',
                    get html() {
                        return `
 <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                <h2 class="h4">${this.title}</h2>
                    <h2 class="fs-lg mb-2 fw-normal fw-500">Click to show sample.</h2>
                ${doc.video('./img/sample/create-gl-guide.mov')}
                </section>`;
                    },
                }

            ];

            return doc.create(
                `
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
                        <div
                            class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2"
                        >
                            <div class="me-4">
                                <h1 class="pb-1">Create-ts-glitter</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">Create-ts-glitter to help you create your glitter-app quickly. </h2>
                                <div class="m-3">
                                    <img src="img/npm.png" class="rounded-3 " style="max-width: 100%;width: 500px;" />
                                </div>
                            </div>
                        </div>
                        ${(() => {
                    let html = '';
                    sessions.map((dd) => {
                        html += dd.html;
                    });
                    return html;
                })()}
                    </div>
                `,
                doc.asideScroller(sessions),
                new Items('Create', gvc)
            );
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
