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
                title: 'Title test',
                subTitle: 'Subtitle test',
            };

            const sessions: { id: string; title: string; html: string }[] = [
                {
                    id: 'Single tab id',
                    // title: '<span class="text-danger me-1">★</span>',
                    title: 'Single tab title',
                    get html() {
                        return /*html*/ ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">abc 1.</h2>
                            ${doc.codePlace(`paste code`, 'language-typescript')}
                        </section>`;
                    },
                },
                {
                    id: 'Multi tab id',
                    title: 'Multi tab title',
                    get html() {
                        return /*html*/ ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4">${this.title}</h2>
                            <h2 class="fs-lg mb-2 fw-normal fw-500">abc 2.</h2>
                            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Code 1`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Code 2`,
                                `<i class="bx bx-show-alt fs-base opacity-70 me-2"></i>Show Result`,
                            ],
                            tab: [
                                doc.codePlace(`paste code 1`, 'language-typescript'),
                                doc.codePlace(`paste code 2`, 'language-typescript'),
                                `<img src="img/appicons/lion.svg" class="rounded-3" style="max-width: 100%;width: 500px;">`,
                            ],
                        })}
                        </section>`;
                    },
                },
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
                new Items(topTitle.title, gvc)
            );
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
